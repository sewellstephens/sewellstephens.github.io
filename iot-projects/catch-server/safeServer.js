const http = require("http");
const url = require('url');
const { serialize } = require("v8");
const port = 3000;

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
            try {
                if (req.method === 'GET') {
                    if (pathname === '/') {
                        res.writeHead(200, { 'content-type': 'text/plain' });
                        res.write(serverStatus);
                    }
                }
                else if (req.method === 'PUT') {
                    if (pathname === '/') {
                        let body = '';
                        req.on('data', (stream) => {
                           console.log(stream);
                           body += stream;
                        });

                        req.on('end', () => {
                            serverStatus = {};
                            serverStatus.status = JSON.parse(body);
                        })

                        res.writeHead(200, { 'content-type': 'text/plain' });
                        res.write('The server has been updated.');
                    }
                }
           }
           catch (err) {
            res.writeHead(500, { 'content-type': 'text/plain' });
               console.error(err);
               res.write('The server has no data');
           }
           finally {
               res.write('-and the message arrived');
               res.end();
           }
}).listen(port);

let serverStatus = undefined;