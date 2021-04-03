const router = require('express').Router();
const PostService = require('../../../services/PostService');
const exceptionHandler = require('../../../utils/request').exceptionHandler;

module.exports = router;

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
router.get('/:postId', exceptionHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await PostService.findOne(postId);
    return res.json(post);
}));
