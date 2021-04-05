const yub = require('yup');
const ValidationError = yub.ValidationError;
const InvalidSubmissionDataError = require('../exceptions/InvalidSubmissionDataError');

function capitalizeFirstLetter(str) {
    if (!str || typeof str !== 'string') {
        return '';
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
}

yub.object.prototype.doValidate = async function (dataToValidate, options) {
    try {
        return await this.validate(dataToValidate, options);
    } catch (e) {
        let errors = null;
        if (e instanceof ValidationError) {
            errors = e.inner.reduce((_errors, one) => {
                _errors[one.path] = capitalizeFirstLetter(one.message);
                return _errors;
            }, {});
        }

        throw new InvalidSubmissionDataError(undefined, errors);
    }
};
