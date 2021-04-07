const HttpResponseError = require('./HttpResponseError');

class ActionNotAcceptableError extends HttpResponseError {
    constructor(message = 'Could not perform action') {
        super(406, message); // Not acceptable
    }
}

module.exports = ActionNotAcceptableError;
