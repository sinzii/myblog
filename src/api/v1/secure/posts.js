const InvalidSubmissionDataError = require('../../../exceptions/InvalidSubmissionDataError');
const exceptionHandler = require('../../../utils/request').exceptionHandler;
const PostService = require('../../../services/PostService');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

const express = require('express');
const router = express.Router();

module.exports = router;

/**
 * Get all active posts by defaults
 */
router.get('/', exceptionHandler(async (req, res) => {
    const posts = await PostService.findAll(req.query);
    return res.json(posts);
}));

/**
 * Create a new post
 */
router.post('/', async (req, res, next) => {
    try {
        const { body } = req;
        const name = body.name;
        if (name) {
            // TODO move this to pre-save hook
            body.slug = String(body.name).trim().replace(/\s+/gm, '-');
        }

        const newPost = new Post(req.body);
        await newPost.save();

        return res.status(201).send();
    } catch (e) {
        console.log(e.message);
        return next(new InvalidSubmissionDataError());
    }
});
