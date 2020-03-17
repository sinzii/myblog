let express = require('express');
let path = require('path');

let app = express();

// Setup express application
app.disable('etag');
app.disable('x-powered-by');

// Setup endpoint
let apiV1 = require('./api/v1');
app.use('/api/v1', apiV1);

app.get('/', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json({code: "Hello World"});
});

// Handle errors

// Setup server
app.listen(3000);