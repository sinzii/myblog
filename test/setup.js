const mongoose = require('mongoose');
const config = require('./config_tests.json');

before(async () => {
    require('../src/customization');

    // Connect mongodb
    const mongooseConfig = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    };

    mongoose.connect(config.mongooseUrl, mongooseConfig);

    // Setup mongoose models
    require('../src/models');
});

after(async () => {
    await mongoose.disconnect();
});
