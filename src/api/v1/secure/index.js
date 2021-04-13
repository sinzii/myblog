const router = require('express').Router();
const postsRouter = require('./posts');
const usersRouter = require('./users');


module.exports = router;

router.use('/posts', postsRouter);
router.use('/users', usersRouter);
