const http = require('http');
const port = process.argv[2];

http.createServer(async (req, res) => {


    const result = await fetch('http://')

    res.writeHead(200, {
        "Content-Type": "application/json"
    })
    res.write("Bet you didn't know, ")
    res.end("Sewell is awesome!")
}).listen(port)