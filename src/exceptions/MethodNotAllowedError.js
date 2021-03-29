const HttpResponseError = require('./HttpRequestError');

class MethodNotAllowedError extends HttpResponseError {
    constructor() {
        super(405); // Method Not Allowed
    }
}

module.exports = MethodNotAllowedError;
