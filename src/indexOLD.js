const Joystick = require('joystick');
const serialport = require('serialport');

const controller = new Joystick(0, 3500, 10);
let actionBuffer = [];
let i = 0;
/*
const handleControllerButton = () => {
  console.log(this);
}

const handleControllerAxis = data => {
  actionBuffer[i] = data;
  // handle skew moves
  if (actionBuffer[i-1]
    && (actionBuffer[i-1].number !== actionBuffer[i].number)
    && (actionBuffer[i-1].timestamp === actionBuffer[i].timestamp)) {
    console.log("skew move" + i);
  }
  i += 1;
}

let lastAction = null;

const test = data => {
  //console.log('lastAction: ', lastAction)
  //console.log('data: ', data)
  if (lastAction && lastAction.time === data.time) {
     //console.log(lastAction.value)
     console.log("same timestamp of: data", data.number, "lastAction", lastAction.number)
     console.log((data.value + 32767)/(2*32767), (lastAction.value + 32767)/(2*32767))
  } else {
    //console.log('set data', data)
    lastAction = data;
  }
}
*/
controller.on('button', console.log);
// controller.on('axis', test);

let values = {
0: 0,
1: 1,
}

const test2 = data=>{
values[data.number] = (data.value + 32767)/(2*32767);
console.log(values[0], values[1]);
}

//setInterval(() => {console.log(values)}, 100);

controller.on('axis', test2);
