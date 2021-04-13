const yup = require('yup');

const CreateUserValidationSchema = yup.object().shape({
    name: yup.string().trim().min(3).max(30),
    username: yup.string().required().trim().lowercase().min(5).max(20),
    email: yup.string().required().email().max(100),
    password: yup.string().required().min(6).max(100),
    avatar: yup.string().url().max(1000),
});

const UpdateUserValidationSchema = yup.object().shape({
    name: yup.string().trim().min(3).max(30),
    username: yup.string().trim().lowercase().min(5).max(20),
    email: yup.string().email().max(100),
    avatar: yup.string().url().max(1000),
});

const UpdatePasswordValidationSchema = yup.object().shape({
    currentPassword: yup.string().required().min(6).max(100),
    newPassword: yup.string().required().min(6).max(100),
});

module.exports = {
    CreateUserValidationSchema,
    UpdateUserValidationSchema,
    UpdatePasswordValidationSchema
};
