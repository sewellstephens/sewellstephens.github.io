const resources = require('./../../resources/model');
const Gpio = require('onoff').Gpio;

let sensor;
const device = resources.pi.sensors.pir;
console.log(device)

const connectHardware = () => {
    sensor = new Gpio(device.gpio, 'in', 'both');
    sensor.watch((err, val) => {
        if (err !== undefined || err !== null) {
            console.error(err);
        }
    })
}

const start = () => {
    connectHardware();
}

const stop = () => {
    sensor.unexport();
}

exports.start = start;
exports.stop = stop;