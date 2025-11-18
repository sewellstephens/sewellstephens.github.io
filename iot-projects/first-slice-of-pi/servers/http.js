const express = require('express'),
cors = require('cors');
const sensorsRoutes = require('../routes/sensors.js');
const actuatorsRoutes = require('../routes/actuators.js');

const app = express();	
app.use(cors());

app.use("/pi/sensors", sensorsRoutes);
app.use("/pi/actuators", actuatorsRoutes);

app.get("/", function (req, res) {
	res.send("the server is running");
});

module.exports = app;
