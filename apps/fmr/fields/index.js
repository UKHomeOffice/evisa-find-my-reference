
/**
 * Validates that the given value only includes letters (a to z), spaces, hyphens, and apostrophes.
 *
 * The validation is case-insensitive and allows:
 * - Uppercase and lowercase letters (a-z, A-Z)
 * - Spaces
 * - Hyphens (-)
 * - Apostrophes (')
 *
 * @param {string} value - The text to validate.
 * @returns {boolean} - Returns true if the value is valid, otherwise false.
 */
function validateText(value) {
    if (value?.length > 0) {
        const regex = /^[a-zA-Z\s'-]+$/;
        return regex.test(value);    
    }
    return true;
}

module.exports = {
    "given-names": {
        mixin: 'input-text',
        validate: [validateText],
        className: ['govuk-input', 'govuk-!-width-two-thirds'],
        labelClassName: 'govuk-label--s'

    },
    "surname": {
        mixin: 'input-text',
        validate: ['required', validateText],
        className: ['govuk-input', 'govuk-!-width-two-thirds'],
        labelClassName: 'govuk-label--s'
    }
};
