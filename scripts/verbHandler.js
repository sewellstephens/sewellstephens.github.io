const http = require('http');
const port = 3000;

let secret = 'NOTHING YET';
const notSecret = 'Sewell Stephens';

const list = [];

http.createServer(function (req, res) {
 if (req.method === `GET`) {
    //init func
    if (req.url === '/secret') {
        res.writeHead(200, {"content-type": "text/plain"});
        res.end(secret);
    }
    else {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end(notSecret);
    }
 }
 else if (req.method === 'PUT') {
    //init func
    res.on('data', (chunk) => {
        secret += chunk.toString();
    });
    res.writeHead(200, { "content-type": "text/plain" });
    res.end(secret);
 }
 else if (req.method === 'POST') {
    //init 
    
    req.on("data", (chunk) => {
       const incomingData = chunk.toString();
       console.log(list);
       list.push(incomingData);
    });

    req.on("end", () => {
        res.writeHead(200, { "content-type": "text/plain" });
        console.log(list);
        res.end(JSON.stringify(list));
    })
 }
 else if (req.method === 'DELETE') {
    //init func
    secret = undefined;

    res.writeHead(201, { 'content-type': 'text/plain' });
    res.end('Secret deleted');
 }
 else {
    //init func
 }
}).listen(port);

console.log(`listening on port ${port}`);
console.log(`http://localhost:${port}`);
