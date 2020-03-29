const HttpResponseError = require('./HttpRequestError');

class ResourceNotFoundError extends HttpResponseError {
    constructor(message = "Seem you're lost!") {
        super(404, message);
    }
}

module.exports = ResourceNotFoundError;
