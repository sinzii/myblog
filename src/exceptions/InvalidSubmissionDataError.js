const HttpResponseError = require('./HttpResponseError');

class InvalidSubmissionDataError extends HttpResponseError {
    constructor(message = 'Invalid submission data', data) {
        super(406, message); // Not acceptable
        this.data = data;
    }

    handleError(req, res) {
        return res.status(this.status).json({ message: this.message, errors: this.data });
    }
}

module.exports = InvalidSubmissionDataError;
