const http = require("http");
const url = require('url');
const { serialize } = require("v8");
const port = 3000;
let serverStatus = {}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
            try {
                if (req.method === 'GET') {
                    if (pathname === '/') {
                        res.writeHead(200, { 'content-type': 'text/plain' });
                        res.write(serverStatus.status);
                    }
                }
                else if (req.method === 'PUT') {
                 
                        let body = '';
                        req.on('data', (stream) => {
                           console.log(stream);
                           body += stream.toString();
                        });

                        req.on('end', () => {
                            console.log()
                            serverStatus = JSON.parse(body);
                        })

                        res.writeHead(200, { 'content-type': 'text/plain' });
                        res.write('The server has been updated.');
                    }
                    else if (req.method === 'DELETE') {
                        serverStatus = {};
                        res.writeHead(200, { 'content-type': 'text/plain' });
                        res.write('delete successful');
                    }
                
           }
           catch (err) {
               console.error(err);
               res.write('The server has no data');
           }
           finally {
               res.write('-and the message arrived');
               res.end();
           }
}).listen(port);

