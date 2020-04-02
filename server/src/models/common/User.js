const mongoose = require('mongoose');
const auditableProps = require('../auditable')();

const UserSchema = new mongoose.Schema(
    Object.assign(
        {
            name: {
                type: String,
                index: true,
            },
            username: {
                type: String,
                unique: true,
                required: true,
            },
            email: {
                type: String,
                unique: true,
                required: true,
            },
            passwordHash: String,
            salt: String,
            avatar: String,
            active: {
                type: Boolean,
                default: true,
            },
        },
        auditableProps
    ),
    {
        timestamps: true,
    }
);

mongoose.model('User', UserSchema);
