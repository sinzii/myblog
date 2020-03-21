class ResourceNotFoundException extends Error {
    constructor(message) {
        super();
        this.status = 404;
        this.message = message || "Seem you're lost!";
    }
}

module.exports = ResourceNotFoundException;