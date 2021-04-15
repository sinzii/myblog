const router = require('express').Router();
const reqUtils = require('../../../utils/request');
const AuthService = require('../../../services/AuthService');

module.exports = router;

/**
 * Sign in
 */
router.post('/sign-in', reqUtils.exceptionHandler(async (req, res, next) => {
    const tokens = await AuthService.signIn(req.body);

    return res.json(tokens);
}));

/**
 * Refresh token
 */
router.post('/refresh-token', reqUtils.exceptionHandler(async (req, res, next) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.doRefreshToken(refreshToken);

    return res.json(tokens);
}));
