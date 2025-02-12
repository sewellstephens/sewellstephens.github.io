// fetchServer.js file
const http = require('http');
const port = 4060;


http.createServer(async function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    fetch('https://sewellstephens.github.io', {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html'
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