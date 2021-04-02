const mongoose = require('mongoose');
const auditableProps = require('../auditable')();
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    Object.assign(
        {
            name: {
                type: String,
                required: true,
            },
            slug: {
                type: String,
                unique: true,
                required: true,
                lowercase: true,
                trim: true,
            },
            content: {
                type: String,
                default: ''
            },
            active: {
                type: Boolean,
                default: true,
            },
            official: Boolean,
            status: {
                type: String,
                enum: ['draft', 'private', 'public'],
                default: 'draft',
                required: true,
            },
            viewsCounter: {
                type: Number,
                default: 0,
            }
        },
        auditableProps
    ),
    {
        timestamps: true,
    }
);

PostSchema.methods.sayHello = function () {
    console.log("Hello world, I'm %s", this.name);
};

mongoose.model('Post', PostSchema);
