const router = require('express').Router();
const ResourceNotFoundException = require('../../../exceptions/404');
const InvalidSubmissionDataException = require('../../../exceptions/InvalidSubmissionDataException');
const MethodNotAllowedException = require('../../../exceptions/MethodNotAllowedException');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');


module.exports = router;

/**
 * Get all official posts
 */
router.get('/', async (req, res) => {
    const posts = await Post.find();
    return res.json(posts);
});

/**
 * Create a new post
 * TODO Move to secure api
 */
router.post('/', async (req, res, next) => {
    try {
        const {body} = req;
        const name = body.name;
        if (name) {
            // TODO move this to pre-save hook
            body.slug = String(body.name).trim().replace(/\s+/gm, '-')
        }

        const newPost = new Post(req.body);
        await newPost.save();

        return res.status(201).send();
    } catch (e) {
        console.log(e.message);
        return next(new InvalidSubmissionDataException())
    }
});

router.all('/', (req, res, next) => {
    next(new MethodNotAllowedException());
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

    next(new ResourceNotFoundException('Post not found'));
});

