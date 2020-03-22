let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let mongoose = require('mongoose');
let ResourceNotFoundException = require('./exceptions/404');
let config = require('./config');
// const debug = require('debug')('app');

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
mongooseConfig = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};

mongoose.connect(config.mongooseUrl, mongooseConfig);
if (config.dev_mode) {
    mongoose.set('debug', true);
}

// Loads mongoose models
require('./models');

/*------------------------------------
    Setup endpoints
------------------------------------*/
let apiV1 = require('./api/v1');
app.use('/api/v1', apiV1);

app.get('/', (req, res) => {
    res.json({message: "Welcome to Project Alpha API"});
});

/*------------------------------------
    Handle errors
------------------------------------*/
app.use((req, res, next) => {
    next(new ResourceNotFoundException());
});

app.use((err, req, res, next) => {
    if (typeof err.handleError === 'function') {
        return err.handleError(req, res);
    }

    const {status} = err;

    if (status) {
        res.status(status);

        const {message} = err;
        if (message) {
            return res.json({message});
        } else {
            return res.send();
        }
    } else {
        const message = "We're getting a problem, please comeback later.";

        return res.status(500).json({message})
    }
});

/*------------------------------------
    Start server
------------------------------------*/
let port = config.httpPort || 3000;
app.listen(port, function () {
    console.log("Server started at port %s", port)
});
