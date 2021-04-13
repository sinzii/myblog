const { exceptionHandler, checkValidId, sendNoContentCode } = require('../../../utils/request');
const UserService = require('../../../services/UserService');
const PostService = require('../../../services/PostService');

const router = require('express').Router();

module.exports = router;

router.param('id', checkValidId);

/**
 * Get all active users
 */
router.get('/', exceptionHandler(async (req, res, next) => {
    const users = await UserService.findAll(req.query);
    UserService.removeSensitiveInformation(users);

    return res.json(users);
}));

/**
 * Create new user
 */
router.post('/', exceptionHandler(async (req, res, next) => {
    const user = await UserService.create(req.body);
    UserService.removeSensitiveInformation([user]);

    return res.json(user);
}));

/**
 * Get user info
 */
router.get('/:id', exceptionHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await UserService.findOne(id);
    UserService.removeSensitiveInformation([user]);

    return res.json(user);
}));

/**
 * Update user info
 */
router.put('/:id', exceptionHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await UserService.update(id, req.body);
    UserService.removeSensitiveInformation([user]);

    return res.json(user);
}));

/**
 * Update user password
 */
router.put('/:id/update-password', exceptionHandler(async (req, res, next) => {
    const { id } = req.params;
    await UserService.updatePassword(id, req.body);

    return sendNoContentCode(res);
}));

/**
 * Deactivate an user
 */
router.put('/:id/deactivate', exceptionHandler(async (req, res, next) => {
    const { id } = req.params;
    await UserService.deactivate(id);

    return sendNoContentCode(res);
}));

/**
 * Activate an user
 */
router.put('/:id/activate', exceptionHandler(async (req, res, next) => {
    const { id } = req.params;
    await UserService.activate(id);

    return sendNoContentCode(res);
}));


/**
 * Get all posts by user
 */
router.get('/:id/posts', exceptionHandler(async (req, res, next) => {
    const { id } = req.params;
    req.query['createdBy'] = id;

    const posts = await PostService.findAll(req.query);

    return res.json(posts);
}));
