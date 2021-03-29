const yub = require('src/customization/yup');
const ValidationError = yub.ValidationError;
const InvalidSubmissionDataError = require('../exceptions/InvalidSubmissionDataError');

yub.object.prototype.doValidate = async function (dataToValidate, options) {
    try {
        await this.validate(dataToValidate, options);
    } catch (e) {
        let errors = null;
        if (e instanceof ValidationError) {
            errors = e.inner.reduce((_errors, one) => {
                _errors[one.path] = one.message;
                return _errors;
            }, {});
        }

        throw new InvalidSubmissionDataError(undefined, errors);
    }
};
