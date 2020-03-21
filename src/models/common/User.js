const mongoose = require('mongoose');
const auditableProps = require('../auditable')();

const UserSchema = new mongoose.Schema(Object.assign({
    name: String,
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    salt: String,
    avatar: String
}, auditableProps));

mongoose.model('User', UserSchema);
