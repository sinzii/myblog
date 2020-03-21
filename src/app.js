let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let mongoose = require('mongoose');
let ResourceNotFoundException = require('./exceptions/404');
let config = require('./config');

let app = express();

/*------------------------------------
    Customize express application
------------------------------------*/
app.disable('etag');
app.disable('x-powered-by');

/*------------------------------------
    Setup logger
------------------------------------*/
app.use(logger('dev')); // Http request logger
// TODO setup logger

/*------------------------------------
    Setup tools
------------------------------------*/
app.use(express.json()); // Allow parsing json object in request body
app.use(express.urlencoded({extended: false})); // Allow parsing urlencoded in submitted body (FORM DATA)
app.use(cookieParser()); // Parse cookies from request and save them to req.cookies

/*------------------------------------
    Setup MongoDB
------------------------------------*/
mongoose.connect(config.mongooseUrl);
if (config.dev_mode) {
    mongoose.set('debug', true);
}

// Loads mongoose modals
require('./models');

/*------------------------------------
    Setup endpoints
------------------------------------*/
let apiV1 = require('./api/v1');
app.use('/api/v1', apiV1);

app.get('/', (req, res) => {
    res.json({message: "Welcome to Project Alpha API"});
});

// A sample error endpoint
app.get('/error', (req, res, next) => {
    next(Error("There is an error"));
});

/*------------------------------------
    Handle errors
------------------------------------*/
app.use((req, res, next) => {
    next(new ResourceNotFoundException());
});

app.use((err, req, res, next) => {
    console.dir(err.constructor.name);

    let statusCode = err.status || 500;
    let message = err.message || "We're getting a problem, please comeback later.";

    res.status(statusCode);
    res.json({
        statusCode,
        message
    });
});

/*------------------------------------
    Start server
------------------------------------*/
app.listen(3000);
