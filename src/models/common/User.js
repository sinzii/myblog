let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
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
});

