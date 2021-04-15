const router = require('express').Router();
const postsRouter = require('./posts');
const authRouter = require('./auth');

module.exports = router;

router.use('/posts', postsRouter);
router.use('/auth', authRouter);
