const defaultConfig = require('./default.json');

const prodMode = process.env.NODE_ENV === 'production';

try {
    // Create a dev.json or prod.json file to override configurations in default.json for customizations
    const overrideConfigName = prodMode ? './prod' : './dev';
    let overrideConfig = require(overrideConfigName);
    Object.assign(defaultConfig, overrideConfig);
} catch (e) {
    // Who am i :))
}

defaultConfig.prod_mode = prodMode;
defaultConfig.dev_mode = !defaultConfig.prod_mode;

module.exports = defaultConfig;
