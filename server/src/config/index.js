let defaultConfig = require('./default');

try {
    // Create a dev.json file to override configurations in default.json for development purpose
    let devConfig = require('./dev');
    Object.assign(defaultConfig, devConfig);
} catch (e) {
    // Who am i :))
}

defaultConfig.prod_mode = process.env.NODE_ENV === 'production';
defaultConfig.dev_mode = !defaultConfig.prod_mode;

module.exports = defaultConfig;
