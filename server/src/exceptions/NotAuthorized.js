const HttpResponseError = require('./HttpRequestError');

class NotAuthorized extends HttpResponseError {
    constructor(message = 'Not authorized') {
        super(401, message);
    }

    handleError(req, res) {
        res.header('WWW-Authenticate', 'Bearer realm="Alpha Secure API"');
        return res.status(this.status).json({ message: this.message });
    }
}

module.exports = NotAuthorized;
