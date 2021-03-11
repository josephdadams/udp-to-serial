//udp-to-serial
const SerialPort = require('serialport');
const udp = require('dgram');
const fs = require('fs');

const configFile = 'config.json';

const config = {
	port_udp: 52381,
	port_serial: '/dev/ttyUSB0',
	baudRate: 9600
};

var serialPort = null; //variable for serial port
var server = null; //variable to store UDP server socket(s)

function loadFile() //loads settings on first load of app
{
	try {
		let rawdata = fs.readFileSync(configFile);
		let myJson = JSON.parse(rawdata);

		if (myJson.port_udp)
		{
			config.port_udp = myJson.port_udp;
		}
	
		if (myJson.port_serial)
		{
			config.port_serial = myJson.port_serial;
		}

		if (myJson.baudRate) {
			config.baudRate = myJson.baudRate;
		}
	}
	catch(error) {
		console.log('Error parsing config file:');
		console.log(error);
	}
}

function createSocket(port) {
	let socket = udp.createSocket('udp4');
	socket.on('error', function(error) {
		console.log('Error: ' + error);
		socket.close();
	});
	
	socket.on('message', function(msg, info) {
		console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);

		//now write it to the serial port
		serialPort.write(msg);
	});
	
	socket.on('listening', function() {
		let address = socket.address();

		console.log('Socket listening at: ' + address.address + ':' + address.port);
	});
	
	socket.on('close', function() {
		console.log('Socket is closed!');
	});
	
	socket.bind(port);
}

function startup() {
	loadFile();

	//Open Serial Port
	console.log('Opening Serial Port: ' + config.port_serial);
	console.log('Baud Rate: ' + config.baudRate);
	serialPort = new SerialPort(config.port_serial, {
		baudRate: config.baudRate
	}, function (err) {
		if (err) {
			console.log('Error opening serial port: ', err.message);
		}
	});

	//Open UDP Port
	server = createSocket(config.port_udp);
}

startup();