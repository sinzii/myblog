const NotAuthorized = require('../../exceptions/NotAuthorized');

let router = require('express').Router();
let publicRouter = require('./public');
let secureRouter = require('./secure');

module.exports = router;

const authentication = (req, res, next) => {
    const authorization = req.header('Authorization');
    if (authorization) {
        const authToken = authorization.trim().split(/\s+/);
        if (authToken.length === 2 && authToken[0] === 'Bearer' && authToken[1]) {
            const token = authToken[1];
            if (token === 'hello-world') {
                return next();
            }
        }
    }
    return next(new NotAuthorized());
};

router.use('/public', publicRouter);
router.use('/secure', authentication, secureRouter);


