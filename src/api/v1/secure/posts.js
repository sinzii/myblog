let express = require('express');
let router = express.Router();

module.exports = router;

router.get('/posts', (req, res) => {
    res.json([
        {
            id: '1',
            content: 'This is a secured post content'
        }
    ])
});

