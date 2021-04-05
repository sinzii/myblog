const yup = require('yup');
const PostStatuses = require('../models/domain/Post').PostStatuses;

const CreatePostValidationSchema = yup.object().shape({
    name: yup.string().required().trim().min(1).max(1000),
    slug: yup.string().trim().lowercase().min(1).max(1000),
    content: yup.string(),
    status: yup.mixed().oneOf(PostStatuses)
});

const UpdatePostValidationSchema = yup.object().shape({
    name: yup.string().trim().min(1).max(1000),
    slug: yup.string().trim().lowercase().min(1).max(1000),
    content: yup.string(),
});


module.exports = {
    CreatePostValidationSchema,
    UpdatePostValidationSchema
}
