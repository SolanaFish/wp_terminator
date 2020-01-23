const Joystick = require('joystick');
const SerialPort = require('serialport')

const controller = new Joystick(0, 3500, 150);
const wheelLU = '/dev/ttyUSB0' // get the port name from the command line
//const wheelRU = '/dev/ttyUSB1'
//const wheelLB = '/dev/ttyUSB2'
//const wheelRB = '/dev/ttyUSB3'
const portLU = new SerialPort(wheelLU, 9600); // open the port

console.log(portLU);
//const portRU = new SerialPort(wheelRU, 9600);
//const portLB = new SerialPort(wheelLB, 9600);
//const portRB = new SerialPort(wheelRB, 9600);

const maxSpeed = 30; // 30 cm/s ~ 1km/h

let wheelsData = ['!0;0;0#', '!0;0;0#', '!0;0;0#', '!0;0;0#'];

function openWheelPort() {
  console.log('port open', portLU);
  // since you only send data when the port is open, this function
  // is local to the openPort() function:
  function sendWheelsData() {
    // convert the value to an ASCII string before sending it:
    portLU.write(wheelsData[0]);
    console.log(`Sending out the wheel serial port`, wheelsData);    

    //portRU.write(wheelsData[1]);
    //portLB.write(wheelsData[2]);
    //portRB.write(wheelsData[3]);
    //console.log(`Sending out the wheel serial port`, wheelsData);
  }
  // set an interval to update the brightness 2 times per second:
  setInterval(sendWheelsData, 300);
}

// !0;cm/s;dir#
// dir - 1 albo 0
// !0... - move !1... - rotate
portLU.on('open', openWheelPort);
// portRU.on('open', openWheelPort(data));
// portLB.on('open', openWheelPort(data));
// portRB.on('open', openWheelPort(data));

let values = {
  0: 0,
  1: 1,
}

const receiveInput = data => {
  let rotateOrMove = 0;
  let speed = .0;
  let dir = 0;
  let force;
  //let wheelsDataArray = [];
  // !rotateOrMove;speed;dir#
  // axis have to handle moving only
  values[data.number] = (data.value + 32767) / (2 * 32767);
  //console.log(values[0], values[1], values[0] + (-values[1]));
  // handling left side, left and down:
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
    //console.log('portleftup', '!0;0;0');
    //console.log('portleftbottom', '!0;0;0');
    //console.log('portrightup', '!0;0;0');
    //console.log('portrightbottom', '!0;0;0');
  }
  console.log(wheelsData);
}

controller.on('axis', receiveInput);

