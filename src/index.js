const Joystick = require('joystick');
const controller = (new Joystick)(0, 3500, 350);

controller.on('button', console.log);
controller.on('axis', console.log);
