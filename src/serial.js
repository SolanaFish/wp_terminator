const SerialPort = require('serialport');
// include the serialport library
const portName = '/dev/ttyUSB0' // get the port name from the command line
const myPort = new SerialPort(portName, 9600);// open the port
//const Readline = require('@serialport/parser-readline')

//const parser = new Readline();
//myPort.pipe(parser);

// these are the definitions for the serial events:

function openPort() {
  let brightness = 0; // the brightness to send for the LED
  console.log('port open', myPort);
  //console.log(`baud rate: ${myPort.options.baudRate}`);

  // since you only send data when the port is open, this function
  // is local to the openPort() function:
  function sendData() {
    // convert the value to an ASCII string before sending it:
    myPort.write('d');
    console.log(`Sending ${brightness} out the serial port`);  
  }
  // set an interval to update the brightness 2 times per second:
  setInterval(sendData, 5000);

}

myPort.on('open', openPort); // called when the serial port opens

//myPort.on('data', (...params) => {
//	const a = JSON.parse(JSON.stringify(params[0]));
//	const b = a.type;
//	const c = JSON.parse(JSON.stringify(a.data));
//	console.log('rec', c);
//
//})

//parser.on('data', console.log)
