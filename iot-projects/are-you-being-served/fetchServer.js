// fetchServer.js file
const http = require('http');
const port = 4060;

const args = process.argv.slice(2);
const url = args[0] ? args[0] : "https://sewellstephens.github.io";


const contentType = args[1] ? args[1] : "text/html";

http.createServer(async function (req, res) {
    res.writeHead(200, { "Content-Type": contentType });
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': contentType,
        }
    })
    .then(async (res1) => {
        const fetchResponse = res1;
        if (fetchResponse.ok) {
           const html = await fetchResponse.text();
           console.log(html)
            res.write(html);

           res.end()
        //    res.writeHead(200, { "Content-Type": "text/html" }).end(html)
        }
        else {
            res.write(`
            <!DOCTYPE html>
            <html>
            <head>
            </head>
            <body>
                <p>${fetchResponse.status} - ${fetchResponse.statusText}</p>
            </body>
            </html>
            `)
        }
    })
}).listen(port);