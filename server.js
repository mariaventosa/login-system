const express = require('express');
var path = require('path');
const app = express();


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/login.html'));
});


const server = app.listen(3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});