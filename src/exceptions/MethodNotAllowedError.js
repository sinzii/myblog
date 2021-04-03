const HttpResponseError = require('./HttpResponseError');

class MethodNotAllowedError extends HttpResponseError {
    constructor() {
        super(405); // Method Not Allowed
    }
}

module.exports = MethodNotAllowedError;
