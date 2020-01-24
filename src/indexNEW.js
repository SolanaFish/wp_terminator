const Joystick = require('joystick');
const controller = new Joystick(0, 3500, 10000);
let actionBuffer = [];
let i = 0;

const handleControllerButton = () => {
  console.log(this);
}

const handleControllerAxis = data => {
  actionBuffer[i] = data;
  if (actionBuffer[i-1] && (actionBuffer[i-1].number !== actionBuffer[i].number)) {
    console.log(actionBuffer[i-1].number)
  }
  i += 1;
}

controller.on('button', console.log);
controller.on('axis', handleControllerAxis);




let lastAction = null;

setInterval(send, 100);

controller.on('axis', (data) => {lastAction = action})

send = () => {
wez last action
mapuj na 4 silniki
wyslij do 4 silnikow
}
