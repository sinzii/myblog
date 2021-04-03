function exceptionHandler(requestHandler) {
    if (!requestHandler || typeof requestHandler !== 'function') {
        throw new Error('Endpoint does not have a handler');
    }

    return async function(req, res, next) {
        try {
            await requestHandler(req, res, next);
        } catch (e) {
            console.log('exceptionHandler', e);
            next(e);
        }
    }
}

module.exports = {
    exceptionHandler
}
