const HttpResponseError = require('./HttpRequestError');

class ResourceNotFound extends HttpResponseError {
    constructor(message = "Seem you're lost!") {
        super(404, message);
    }
}

module.exports = ResourceNotFound;