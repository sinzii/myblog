const exceptionHandler = require('../../../utils/request').exceptionHandler;
const PostService = require('../../../services/PostService');

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
 * Get a post
 */
router.get('/:postId', exceptionHandler(async (req, res, next) => {
    const { postId } = req.params;

    // TODO update post permissions

    const post = await PostService.findOne(postId);
    return res.json(post);
}));

/**
 * Create a new post
 */
router.post('/', exceptionHandler(async (req, res, next) => {
    const post = await PostService.create(req.body);
    return res.json(post);
}));

/**
 * Update a post
 */
router.put('/:postId', exceptionHandler(async (req, res, next) => {
    const { postId } = req.params;
    const targetPost = await PostService.update(postId, req.body);
    return res.json(targetPost);
}));
