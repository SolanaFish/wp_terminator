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

const maxSpeed = 30; // 30 cm/s ~ 1km/h

function openWheelPort() {
  console.log('port open');
}

function sendWheelsData() {
    let wheelsData = ['!0;0;0#', '!0;0;0#', '!0;0;0#', '!0;0;0#'];

    if (values[0] < values[1]) {
        // pure left - rotate in place
        if (values[1] === 0.5) {
          force = parseInt((1 - values[0]) * maxSpeed);
          wheelsData = [`!0;${force};1#`, `!0;${force};0#`, `!0;${force};1#`, `!0;${force};0#`];
        }
        // pure down
        if (values[0] === 0.5) {
          force = parseInt((values[1])*maxSpeed);
          wheelsData = [`!0;${force};0#`, `!0;${force};0#`, `!0;${force};0#`, `!0;${force};0#`];
        }
      }
      if (values[0] > values[1]) {
        // pure forward
        if (values[0] === 0.5) {
          force = parseInt((1 - values[1]) * maxSpeed);
          wheelsData = [`!0;${force};1#`, `!0;${force};1#`, `!0;${force};1#`, `!0;${force};1#`];
        }
        // pure right
        if (values[1] === 0.5) {
          force = parseInt((values[0]) * maxSpeed);
          wheelsData = [`!0;${force};0#`, `!0;${force};1#`, `!0;${force};0#`, `!0;${force};1#`];
        }
      }
      // reset
      if (values[0] === 0.5 && values[1] === 0.5) {
        wheelsData = ['!0;0;0#', '!0;0;0#', '!0;0;0#', '!0;0;0#'];
      }

    portLU.write(wheelsData[0]);
    portRU.write(wheelsData[1]);
    portLB.write(wheelsData[2]);
    portRB.write(wheelsData[3]);
    console.log(`Sending out the wheel serial port`, wheelsData);
  }

  setTimeout(() => {
    setInterval(sendWheelsData, 100);
  }, 5000);

// !0;cm/s;dir#
// dir - 1 albo 0
// !0... - move !1... - rotate
portLU.on('open', openWheelPort);
portRU.on('open', openWheelPort);
portLB.on('open', openWheelPort);
portRB.on('open', openWheelPort);

let values = {
  0: 0,
  1: 1,
}

const receiveInput = data => {
  values[data.number] = (data.value + 32767) / (2 * 32767);
}

controller.on('axis', receiveInput);