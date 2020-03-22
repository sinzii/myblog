const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = function () {
    return {
        createBy: {
            type: Schema.Types.ObjectID,
            ref: 'User'
        },
        createAt: Date,
        updateBy: {
            type: Schema.Types.ObjectID,
            ref: 'User'
        },
        updateAt: Date
    }
};