# udp-to-serial
A Node.js server that listens to a specified UDP port and writes whatever data it receives to a local serial port.

Written so we could send VISCA via UDP to a local RS-485 serial adapter to control multiple Marshall CV503 cameras.

Known to work with this adapter:
https://www.amazon.com/gp/product/B078X5H8H7/
DSD TECH SH-U10 USB to RS485 Converter with CP2102 Chip Compatible with Windows 7,8,10,Linux,Mac OS

## Installing this software:
* Copy the code to a working directly on your computer. Make sure Node is installed.
* Run `npm install` to make sure all required modules are downloaded and installed.
* Run `node index.js` to start the server.

## Running via `pm2`
* Install `pm2`: `sudo npm install pm2 -g`
* Within the `udp-to-serial` folder, type: `pm2 start index.js --name udp-to-serial`
* `pm2 startup`
* `pm2 save`

By default, the server will attempt to open:
* UDP Port `52381`
* Serial Port `/dev/ttyUSB0` with a baud rate of `9600`

This is configurable by modifying the `config.json` file.

If you're not sure what your serial port address is, on Linux, you can run this command:

`dmesg | grep tty`

It will filter the list to show you the serial ports.
