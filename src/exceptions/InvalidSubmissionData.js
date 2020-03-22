const HttpResponseError = require('./HttpRequestError');

class InvalidSubmissionData extends HttpResponseError {
    constructor(message = "Invalid submission data", data) {
        super(406, message); // Not acceptable
        this.data = data;
    }
}

module.exports = InvalidSubmissionData;