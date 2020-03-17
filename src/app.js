let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');

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
    Setup endpoints
------------------------------------*/
let apiV1 = require('./api/v1');
app.use('/api/v1', apiV1);

app.get('/', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json({message: "Welcome to Project Alpha API"});
});

// A sample error endpoint
app.get('/error', (req, res) => {
   throw Error("There is an error");
});

/*------------------------------------
    Handle errors
------------------------------------*/
app.use((req, res, next) => {
    res.status(404);
    res.json({
        code: 404,
        message: "You're lost!"
    });
});

app.use((err, req, res, next) => {
    console.log(err.message);

    res.status(500);
    res.json({
        code: 500,
        message: "We're getting a problem, please comeback later."
    });
});

/*------------------------------------
    Start server
------------------------------------*/
app.listen(3000);
