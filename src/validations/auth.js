const yup = require('yup');

const SignInValidationSchema = yup.object().shape({
    id: yup.string().required().trim().min(5).max(100),
    password: yup.string().required().min(6).max(100),
});

module.exports = {
    SignInValidationSchema
}
