const router = require('express').Router();
const ResourceNotFoundError = require('../../../exceptions/404Error');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const validator = require('validator');

module.exports = router;

/**
 * Get all official posts
 */
router.get('/', async (req, res) => {
    let { limit, startingAfter, endingBefore } = req.query;

    limit = validator.isNumeric(limit) ? Number(limit) : 10;
    limit = limit > 100 || limit <= 0 ? 10 : limit;

    let conditions = { official: true };
    if (startingAfter) {
        conditions._id = {
            $gt: startingAfter
        };
    } else if (endingBefore) {
        conditions._id = {
            $lt: endingBefore
        };
    }

    const posts = await Post.find(conditions).sort({ _id: 1 }).limit(limit);
    return res.json(posts);
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
        console.log(e);
        next(e);
        return;
    }

    next(new ResourceNotFoundError('Post not found'));
});
