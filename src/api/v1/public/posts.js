const router = require('express').Router();
const PostService = require('../../../services/PostService');
const exceptionHandler = require('../../../utils/request').exceptionHandler;
const checkValidId = require('../../../utils/request').checkValidId;
const ResourceNotFoundError = require('../../../exceptions/404Error');

module.exports = router;

router.param('id', checkValidId);

/**
 * Get all official & active posts
 */
router.get('/', exceptionHandler(async (req, res) => {
    delete req.query.status;
    delete req.query.active;
    req.query.official = 'true';

    const posts = await PostService.findAll(req.query);
    return res.json(posts);
}));

/**
 * Get a specific post
 */
router.get('/:id', exceptionHandler(async (req, res, next) => {
    const { id } = req.params;
    const post = await PostService.findOne(id);

    if (post.isOfficial()) {
        return res.json(post);
    }

    next(new ResourceNotFoundError('Post is not existed'));
}));
