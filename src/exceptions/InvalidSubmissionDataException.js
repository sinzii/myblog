class InvalidSubmissionDataException extends Error {
    constructor(message, data) {
        super();
        this.status = 406; // Not acceptable
        this.message = message || "Invalid submission data";
        this.data = data;
    }
}

module.exports = InvalidSubmissionDataException;