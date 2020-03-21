let defaultConfig = require('./default');

try {
    let devConfig = require('./dev');
    Object.assign(defaultConfig, devConfig);
} catch (e) {
    //
}

defaultConfig.prod_mode = process.env.NODE_ENV === 'production';
defaultConfig.dev_mode = !defaultConfig.prod_mode;

module.exports = defaultConfig;
