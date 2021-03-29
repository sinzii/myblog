const log4js = require('log4js');
const config = require('../config');

log4js.configure({
    appenders: {
        console: {
            type: 'console',
        },
        file: {
            type: 'file',
            filename: './logs/myblog.log',
            maxLogSize: 10 * 1024 * 1024, // 10MB
            backups: 3,
        },
        dateFile: {
            type: 'dateFile',
            filename: './logs/myblog.log',
            pattern: '.yyyy-MM-dd',
        },
    },
    categories: {
        default: {
            appenders: config.logAppender || ['console', 'dateFile'],
            level: config.logLevel || 'INFO',
        },
    },
});
