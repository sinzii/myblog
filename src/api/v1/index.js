let router = require('express').Router();
let publicRouter = require('./public');
let secureRouter = require('./secure');

module.exports = router;

router.use('/public', publicRouter);
router.use('/secure', secureRouter);
