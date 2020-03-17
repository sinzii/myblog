let router = require('express').Router();

module.exports = router;

router.get('/posts', (req, res) => {
    res.json([
        {
            id: '1',
            content: 'This is a public post content'
        }
    ])
});

