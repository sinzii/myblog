const NotAuthorized = require('../../exceptions/NotAuthorized');

let router = require('express').Router();
let publicRouter = require('./public');
let secureRouter = require('./secure');

module.exports = router;

const authentication = (req, res, next) => {
    const authorization = req.header('Authorization');
    if (authorization) {
        const authToken = authorization.trim().split(/\s+/);
        const [authType, token] = authToken;

        if (authType === 'Bearer' && token === 'hello-world') {
            return next();
        }
    }
    return next(new NotAuthorized());
};

router.use('/public', publicRouter);
router.use('/secure', authentication, secureRouter);


