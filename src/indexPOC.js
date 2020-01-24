const Joystick = require('joystick');
const SerialPort = require('serialport')

const controller = new Joystick(0, 3500, 10);
const portName = '/dev/ttyUSB0' // get the port name from the command line
const myPort = new SerialPort(portName, 9600); // open the port

const maxSpeed = 250; // 250 cm/s ~ 9km/h

function openPort() {
  let brightness = 0; // the brightness to send for the LED
  console.log('port open', myPort);

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
// !0;cm/s;dir#
// dir - 1 albo 0
// !0... - move !1... - rotate
myPort.on('open', openPort);

let values = {
  0: 0,
  1: 1,
}

const test2 = data => {
  let rotateOrMove = 0;
  let speed = .0;
  let dir = 0;
  // !rotateOrMove;speed;dir#
  // axis have to handle moving only
  values[data.number] = (data.value + 32767)/(2*32767);
  console.log(values[0], values[1], values[0]+(-values[1]));
  if (values[0] < values[1]) {
    // handling left side, left and down
    // pure left - rotate in place
    if (values[1] === 0.5) {
      let force = (1-values[0])*250;
      console.log('portleftup', `!0;${force};1`);
      console.log('portleftbottom', `!0;${force};1`);
      console.log('portrightup', `!0;${force};0`);
      console.log('portrightbottom', `!0;${force};0`);
    }
    // pure down
    if (values[0] === 0.5) {
      let force = (values[1])*250;
      console.log('portleftup', `!0;${force};0`);
      console.log('portleftbottom', `!0;${force};0`);
      console.log('portrightup', `!0;${force};0`);
      console.log('portrightbottom', `!0;${force};0`);
    }
  }
  if (values[0] > values[1]) {
    // pure forward
    if (values[0] === 0.5) {
      let force = (1-values[1])*250;
      console.log('portleftup', `!0;${force};1`);
      console.log('portleftbottom', `!0;${force};1`);
      console.log('portrightup', `!0;${force};1`);
      console.log('portrightbottom', `!0;${force};1`);
    }
    // pure right
    if (values[1] === 0.5) {
      console.log('portleftup', '!0;value[1];0');
      console.log('portleftbottom', '!0;value[1];0');
      console.log('portrightup', '!0;value[1];1');
      console.log('portrightbottom', '!0;value[1];1');
    }
  }
  // reset
  if (values[0] === 0.5 && values[1] === 0.5) {
    console.log('portleftup', '!0;0;0');
    console.log('portleftbottom', '!0;0;0');
    console.log('portrightup', '!0;0;0');
    console.log('portrightbottom', '!0;0;0');
  }
  // speed =  / 250;
}

//setInterval(() => {console.log(values)}, 100);

controller.on('axis', test2);
