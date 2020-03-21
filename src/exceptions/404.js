class ResourceNotFoundException extends Error {
    constructor(message) {
        super();
        this.status = 404;
        this.message = message || "Seem you're lost!";
    }

    handleException(req, res) {
        console.log("Haha I'm hanelding this exception");

        return res.status(this.status).json({message: 'You are lost, please go back where you came from :D'})
    }
}

module.exports = ResourceNotFoundException;