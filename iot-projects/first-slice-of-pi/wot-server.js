const httpServer = require('./servers/http'),
	resources = require('./resources/model');

const pirPlugin = require("./plugins/internal/pirPlugin");

pirPlugin.start({});

httpServer.listen(resources.pi.port, function () {
	console.log("Running the Pi on port " + resources.pi.port);
});

process.on('SIGINT', function() {
	pirPlugin.stop();
	process.exit();
});
