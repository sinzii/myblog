const ResourceNotFoundError = require('../exceptions/404Error');
const typeUtils = require('./types');
const logger = require('log4js').getLogger('app');

function exceptionHandler(requestHandler) {
    if (!requestHandler || typeof requestHandler !== 'function') {
        throw new Error('Endpoint does not have a handler');
    }

    return async function(req, res, next) {
        try {
            await requestHandler(req, res, next);
        } catch (e) {
            logger.error(e);
            next(e);
        }
    }
}

function checkValidId(req, res, next, id) {
    if (!typeUtils.isValidId(id)) {
        next(new ResourceNotFoundError('Resource is not existed'));
    }

    next();
}

function sendNoContentCode(res) {
    return res.status(204).send();
}

module.exports = {
    exceptionHandler,
    checkValidId,
    sendNoContentCode
}
