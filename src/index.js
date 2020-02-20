const Joystick = require('joystick');
const SerialPort = require('serialport')

const baudRate = 9600;

const controller = new Joystick(0, 3500, 150);
const wheelLU = '/dev/ttyUSB0'
const wheelRU = '/dev/ttyUSB1'
const wheelLB = '/dev/ttyUSB2'
const wheelRB = '/dev/ttyUSB3'

const portLU = new SerialPort(wheelLU, baudRate); // open the port
const portRU = new SerialPort(wheelRU, baudRate); // open the port
const portLB = new SerialPort(wheelLB, baudRate); // open the port
const portRB = new SerialPort(wheelRB, baudRate); // open the port

function openWheelPort() {
  console.log('port open');
}

const maxSpeed = 9;

function sendWheelsData() {
let wheelsData = ['!0;0;0#', '!0;0;0#', '!0;0;0#', '!0;0;0#'];

let speed = 1;
let rightWheelsSpeed = 0;
let leftWheelsSpeed = 0;
let dir = 1;

if (lastData[1] < 0.5) {
  // move forward
  speed = Math.floor((1 - lastData[1]) * maxSpeed);
  dir = 1;
} else if (lastData[1] > 0.5) {
  // move back
  speed = Math.floor(lastData[1] * maxSpeed);
  dir = 0;
} else {
  speed = 0;
}

if (lastData[0] > 0.5) {
  // move right
  rightWheelsSpeed = Math.floor(lastData[0] * maxSpeed); 
} else if (lastData[0] < 0.5) {
  // move left
  leftWheelsSpeed = Math.floor((1 - lastData[0]) * maxSpeed);
}

wheelsData = [`!${rightWheelsSpeed || speed};${dir}#`, `!${leftWheelsSpeed || speed};${dir}#`, `!${rightWheelsSpeed || speed};${dir}#`, `!${leftWheelsSpeed || speed};${dir}#`];
console.log(wheelsData);
/*

if (lastData[0] < lastData[1]) {
  // pure left - rotate in place
  if (lastData[1] === 0.5) {
    force = parseInt((1 - lastData[0]) * maxSpeed);
    wheelsData = [`!0;${force};1#`, `!0;${force};0#`, `!0;${force};1#`, `!0;${force};0#`];
  }

  // pure down
  if (lastData[0] === 0.5) {
    force = parseInt((lastData[1])*maxSpeed);
    wheelsData = [`!0;${force};0#`, `!0;${force};0#`, `!0;${force};0#`, `!0;${force};0#`];
  }
}

if (lastData[0] > lastData[1]) {
  // pure forward
  if (lastData[0] === 0.5) {
    force = parseInt((1 - lastData[1]) * maxSpeed);
    wheelsData = [`!0;${force};1#`, `!0;${force};1#`, `!0;${force};1#`, `!0;${force};1#`];
  }

  // pure right
  if (lastData[1] === 0.5) {
    force = parseInt((lastData[0]) * maxSpeed);
    wheelsData = [`!0;${force};0#`, `!0;${force};1#`, `!0;${force};0#`, `!0;${force};1#`];
  }
}

*/

// reset
if (lastData[0] === 0.5 && lastData[1] === 0.5) {
  wheelsData = ['!0;0;0#', '!0;0;0#', '!0;0;0#', '!0;0;0#'];
}


    portLU.write(wheelsData[0]);
    portRU.write(wheelsData[1]);
    portLB.write(wheelsData[2]);
    portRB.write(wheelsData[3]);
  }

portLU.on('open', openWheelPort);
portRU.on('open', openWheelPort);
portLB.on('open', openWheelPort);
portRB.on('open', openWheelPort);

let lastData = {
  0: 0.5,
  1: 0.5,
}

let currentData = {
  0: 0.5,
  1: 0.5,
}

const sendData = () => {
  if (lastData[0] !== currentData[0]) {
    lastData[0] = currentData[0];
    //console.log('horizontal move');
    sendWheelsData();
  } else if (lastData[1] !== currentData[1]) {
    lastData[1] = currentData[1];
    //console.log('vertical move');
    sendWheelsData();
  } else {
    //console.log('no move');
  }

}

const receiveInput = data => {
  if (parseInt(data.number) < 2) {
    currentData[data.number] = parseFloat(((data.value + 32767) / (2 * 32767)).toFixed(1)); //parseuje do 2 miejsce po przecinku
  }
}

controller.on('axis', receiveInput);

setInterval(sendData, 500);
