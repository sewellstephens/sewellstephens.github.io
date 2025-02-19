const http = require("http");
const async = require("async");

const port = 8686;

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    
    let racers = ["Green Ambler", "Catalack", "Steel Runner", "G.I. Jogger"];

    // TODO 7: Get the start time for the race
    let d = new Date();

const startTime = d.getTime();

const wrapper = (callback) => {
    setTimeout(() => {
        const d = new Date();
        callback(null, d.getTime())

    }, Math.random() * 1000)
}

    // TODO 12: Make the whole thing parallel
    async.series( 
        // TODO 9: Supply an array of functions
        [
            function (callback) {
                wrapper(callback);
              },
              function (callback) {
                wrapper(callback);
              },
              function (callback) {
                wrapper(callback);
              },
              function (callback) {
                wrapper(callback);
              },
        ],
        function (error, results) {
            // TODO 10: add a callback function to the end of the async call to tally the results 
            res.write("Results:\n");
            var victoryOrder = sortTogether(racers, results);
            res.write(racerName + "\n");

            let d = new Date();
            let endTime = d.getTime();

            let duration = endTime - startTime;
            res.write("Race Duration: " + duration + "ms\n");
        }
    );
    
}).listen(port);

// sortTogether takes in an array of racer names and an array of times that the racers finished the race.
// It returns a new array of names, with the list or racers sorted by the time that they finished.
function sortTogether(names, times) {
    var tempList = [];
    for (var i = 0; i < names.length; i++) {
        tempList.push({'name': names[i], 'time': times[i]});
    }

    tempList.sort(function(a, b) {
        return ((a.time < b.time) ? -1 : ((a.time == b.time) ? 0 : 1));
    });

    for (var i = 0; i < tempList.length; i++) {
        names[i] = tempList[i].name;
    }
    return names;
}
