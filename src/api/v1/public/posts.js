const router = require('express').Router();
const ResourceNotFoundError = require('../../../exceptions/404Error');
const MethodNotAllowedError = require('../../../exceptions/MethodNotAllowedError');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports = router;

/**
 * Get all official posts
 */
router.get('/', async (req, res) => {
    const posts = await Post.find({ official: true });
    return res.json(posts);
});

router.all('/', (req, res, next) => {
    next(new MethodNotAllowedError());
});

/**
 * Get a specific post
 */
router.get('/:postId', async (req, res, next) => {
    const { postId } = req.params;

    try {
        const targetPost = await Post.findById(postId);
        if (targetPost) {
            return res.json(targetPost);
        }
    } catch (e) {
        // What is this??
    }

    next(new ResourceNotFoundError('Post not found'));
});
