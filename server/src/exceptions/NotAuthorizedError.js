const HttpResponseError = require('./HttpRequestError');

class NotAuthorizedError extends HttpResponseError {
    constructor(message = 'Not authorized') {
        super(401, message);
    }

    handleError(req, res) {
        res.header('WWW-Authenticate', 'Bearer realm="Secure API"');
        return res.status(this.status).json({ message: this.message });
    }
}

module.exports = NotAuthorizedError;
