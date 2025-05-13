const express = require('express');
const port = 3000;
const json2html = require('node-json2html');
const dotenv = require('dotenv');

dotenv.config();

const mid1 = (req, res, next) => {
    req.first = "first";
    next();
}

const mid2 = (req, res, next) => {
    req.second = "second";
    next();
}

const mid3 = (req, res, next) => {
    req.third = "third";
    res.send(`first:${req.first} second:4${req.second} third:${req.third} fourth:${req.fourth}`);
}

const mid4 = (req, res, next) => {
    req.fourth = "fourth"
    next();
}

const app = express();

const data = {
    'name': 'do',
    'age': 'you',
    'type': 'want',
    'secret1': process.env.SECRET
}

let transform = {"<>": "p", text: "${name} ${age} ${type} ${secret1}"};
let html = json2html.render(data, transform);

/*
app.get('/secret', mid4);
app.use(mid1);
app.use(mid2);
app.use(mid3);
*/
app.get('/secret', (req, res, next) => {
    res.send(html.split('><').join('>\n<'))
})

app.listen(port, () => {
    console.log(`app avaliable at http://localhost${port}`);
    console.log(html.split('><').join('>\n<'));
})