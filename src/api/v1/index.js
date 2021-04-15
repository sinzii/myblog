const NotAuthorizedError = require('../../exceptions/NotAuthorizedError');
const AuthService = require('../../services/AuthService');
const reqUtil = require('../../utils/request');

let router = require('express').Router();
let publicRouter = require('./public');
let secureRouter = require('./secure');

module.exports = router;

const authentication = async (req, res, next) => {
    const authorization = req.header('Authorization');
    if (authorization) {
        const authToken = authorization.trim().split(/\s+/);
        const [authType, token] = authToken;

        if (authType === 'Bearer' && token) {
            const { payload, currentUser } = await AuthService.checkAccessToken(token);
            req.payload = payload;
            req.currentUser = currentUser;

            return next();
        }
    }
    return next(new NotAuthorizedError());
};

router.use('/public', publicRouter);
router.use('/secure', reqUtil.exceptionHandler(authentication), secureRouter);
