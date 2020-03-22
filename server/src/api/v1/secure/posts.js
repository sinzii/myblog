const InvalidSubmissionData = require('../../../exceptions/InvalidSubmissionData');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

const express = require('express');
const router = express.Router();

module.exports = router;

router.get('/', (req, res) => {
    res.json([
        {
            id: '1',
            content: 'This is a secured post content'
        }
    ])
});

/**
 * Create a new post
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
        return next(new InvalidSubmissionData())
    }
});

