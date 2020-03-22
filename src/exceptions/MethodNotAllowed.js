const HttpResponseError = require('./HttpRequestError');

class MethodNotAllowed extends HttpResponseError {
    constructor() {
        super(405); // Method Not Allowed
    }
}

module.exports = MethodNotAllowed;