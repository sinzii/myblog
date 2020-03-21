class MethodNotAllowedException extends Error {
    constructor() {
        super();
        this.status = 405; // Method Not Allowed
    }
}

module.exports = MethodNotAllowedException;