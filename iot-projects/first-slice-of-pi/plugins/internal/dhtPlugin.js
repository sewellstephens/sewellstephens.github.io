const resources = require('./../../resources/model');
const sensorDriver = require('node-dht-sensor');

let interval, sensor;
const device = resources.pi.sensors.dht;
let localParams = {'frequency': 2000};

const connectHardware = () => {
    sensor = {
        initialize: function(){
            // initialize function body
            sensorDriver.initialize(device.model, device.gpio)
        },
        read: function(){
            // read function body
            let readData = sensorDriver.read();
            device.temperature.value = parseFloat(readData.temperature);
            device.humidity.value = parseFloat(readData.temperature);

        }
    }
    
}

interval = setInterval(function () {
    sensor.read();
  }, localParams.frequency);


const start = (params) => {
    localParams = params ? params : localParams;
    connectHardware();
}

const stop = () => {
    clearInterval(interval);
}

exports.start = start;
exports.stop = stop;