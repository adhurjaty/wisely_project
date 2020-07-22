const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');

const proxy = require('http-proxy').createProxyServer({
    host: 'http://api:5000'
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', function(req, res, next) {
    proxy.web(req, res, {
        target: 'http://api:5000'
    }, next);
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

var httpServer = http.createServer(app)
httpServer.listen(3000);
console.log('Running on PORT 3000');
// app.listen(process.env.PORT || 3000, () => console.log(`Running on PORT ${process.env.PORT || 3000}`));
// Redirect from http port to https

