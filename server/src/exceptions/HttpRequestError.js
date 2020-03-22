class HttpRequestError extends Error {
    constructor(status, message) {
        super();
        if (!status) {
            throw new Error("Please set status code for this error");
        }

        this.status = status;
        this.message = message;
    }
}

module.exports = HttpRequestError;