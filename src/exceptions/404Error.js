const HttpResponseError = require('./HttpResponseError');

class ResourceNotFoundError extends HttpResponseError {
    constructor(message = "Seem you're lost!") {
        super(404, message);
    }
}

module.exports = ResourceNotFoundError;
