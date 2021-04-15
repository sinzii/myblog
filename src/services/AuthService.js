const validator = require('validator');
const UserService = require('./UserService');
const jwt = require('jsonwebtoken');
const { NotBeforeError, JsonWebTokenError, TokenExpiredError } = jwt;
const config = require('../config');
const AuthValidations = require('../validations/auth');
const InvalidSubmissionDataError = require('../exceptions/InvalidSubmissionDataError');

class AuthService {
    async signIn(signInDTO) {
        signInDTO = await AuthValidations.SignInValidationSchema.doValidate(signInDTO, {
            stripUnknown: true,
            abortEarly: false
        });

        const { id, password } = signInDTO;

        const targetUser = validator.isEmail(id)
            ? await UserService.findOneByEmail(id, false)
            : await UserService.findOneByUsername(id, false);

        if (!targetUser) {
            throw new InvalidSubmissionDataError('Username or password is not valid');
        }

        const validPassword = await UserService.isValidPassword(targetUser, password);

        if (!validPassword) {
            throw new InvalidSubmissionDataError('Username or password is not valid');
        }

        return this._issueTokens(targetUser);
    }

    _issueTokens(targetUser) {
        if (!targetUser.active) {
            throw new InvalidSubmissionDataError('User has been suspended, please contact the administrator for more information');
        }

        const payload = {
            name: targetUser.name,
            username: targetUser.username,
            email: targetUser.email,
        };

        const {
            issuer = 'MyBlogAPI',
            accessTokenSecretKey = 'DefaultAccessTokenSecretKey',
            refreshTokenSecretKey = 'DefaultRefreshTokenSecretKey',
            accessTokenExpiresInDay = 14,
            refreshTokenExpiresInDay = 15
        } = config.auth;

        const accessTokenExpiresIn = accessTokenExpiresInDay * 24 * 60 * 60;

        const accessToken = jwt.sign(payload, accessTokenSecretKey, {
            expiresIn: accessTokenExpiresIn,
            issuer: issuer,
        });

        const refreshTokenExpiresIn = refreshTokenExpiresInDay * 24 * 60 * 60;
        payload.purpose = 'refresh';

        const refreshToken = jwt.sign(payload, refreshTokenSecretKey, {
            expiresIn: refreshTokenExpiresIn,
            issuer: issuer,
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async checkAccessToken(accessToken) {
        try {
            const payload = jwt.verify(accessToken, config.auth.accessTokenSecretKey);
            return {
                payload,
                currentUser: await UserService.findOneByUsername(payload.username)
            }
        } catch (e) {
            if (e instanceof NotBeforeError) {
                throw new InvalidSubmissionDataError('Token is not active');
            } else if (e instanceof TokenExpiredError) {
                throw new InvalidSubmissionDataError('Token is not expired');
            } else {
                throw new InvalidSubmissionDataError('Token is not valid');
            }
        }
    }

    async doRefreshToken(refreshToken) {
        try {
            if (!refreshToken) {
                throw new InvalidSubmissionDataError('Refresh token is required');
            }

            const payload = jwt.verify(refreshToken, config.auth.refreshTokenSecretKey);
            if (payload.purpose !== 'refresh') {
                throw new Error();
            }

            // todo check maximum refresh time using redis server

            const targetUser = await UserService.findOneByUsername(payload.username)
            const tokens = this._issueTokens(targetUser);

            // todo update refresh time using current token

            return tokens;
        } catch (e) {
            if (e instanceof NotBeforeError) {
                throw new InvalidSubmissionDataError('Token is not active');
            } else if (e instanceof TokenExpiredError) {
                throw new InvalidSubmissionDataError('Token is not expired');
            } else if (e instanceof InvalidSubmissionDataError) {
                throw e;
            }

            throw new InvalidSubmissionDataError('Token is not valid');
        }
    }
}

module.exports = new AuthService();
