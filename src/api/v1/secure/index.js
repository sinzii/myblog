let router = require('express').Router();
let postsRouter = require('./posts');

module.exports = router;

router.use('/', postsRouter);
