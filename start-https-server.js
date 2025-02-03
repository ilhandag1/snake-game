const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

// Serve static files
app.use(express.static(__dirname));

// Serve service worker with specific headers
app.get('/service-worker.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'service-worker.js'));
});

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
    requestCert: false,
    rejectUnauthorized: false
};

const server = https.createServer(options, app);

server.listen(8443, () => {
    console.log('HTTPS Server running at https://localhost:8443/');
});