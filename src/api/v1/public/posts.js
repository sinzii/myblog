const router = require('express').Router();
const ResourceNotFound = require('../../../exceptions/404');
const MethodNotAllowed = require('../../../exceptions/MethodNotAllowed');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');


module.exports = router;

/**
 * Get all official posts
 */
router.get('/', async (req, res) => {
    const posts = await Post.find({official: true});
    return res.json(posts);
});

router.all('/', (req, res, next) => {
    next(new MethodNotAllowed());
});

/**
 * Get a specific post
 */
router.get('/:postId', async (req, res, next) => {
    const {postId} = req.params;

    try {
        const targetPost = await Post.findById(postId);
        if (targetPost) {
            return res.json(targetPost);
        }
    } catch (e) {
        // What is this??
    }

    next(new ResourceNotFound('Post not found'));
});

