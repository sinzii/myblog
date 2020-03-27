const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = function () {
    return {
        createdBy: {
            type: Schema.Types.ObjectID,
            ref: 'User'
        },
        createdAt: Date,
        updatedBy: {
            type: Schema.Types.ObjectID,
            ref: 'User'
        },
        updatedAt: Date
    }
};