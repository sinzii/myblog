let express = require('express');

let app = express();
app.disable('etag');
app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json({code: "Hello World"});
});

app.listen(3000);