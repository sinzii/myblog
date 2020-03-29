const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const auditableProps = require('../auditable')();

const CommentSchema = new Schema(
    Object.assign(
        {
            post: {
                type: Schema.ObjectID,
                ref: 'Post',
                required: true,
            },
            content: String,
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

mongoose.model('Comment', CommentSchema);
