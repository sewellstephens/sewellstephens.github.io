const express = require('express');
const cors = require('cors');
const resource = require('./resource.json');
const app = express();
const routes = require('./routes.js')

const port = 3000

app.use(cors());

app.use("/life", routes);

app.get('/', (req, res) => {
  res.send(resource);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(resource);
})
