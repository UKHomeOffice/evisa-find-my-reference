const countries = require('hof').utils.countries();
const dateComponent = require('hof').components.date;

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

/**
 * Validation rule to exclude the value 'United Kingdom'.
 * @param {string} value - The value to be checked.
 * @returns {boolean} - Returns true if the value is not 'United Kingdom', otherwise false.
 */
function excludeUK(value) {
  return value !== 'United Kingdom';
}

module.exports = {
  'given-names': {
    mixin: 'input-text',
    validate: [validateText],
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    labelClassName: 'govuk-label--s'

  },
  surname: {
    mixin: 'input-text',
    validate: ['required', validateText],
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    labelClassName: 'govuk-label--s'
  },
  sex: {
    mixin: 'radio-group',
    validate: ['required'],
    options: [
      'female',
      'male',
      'other'
    ],
    className: ['block', 'form-group']
  },
  'country-of-nationality': {
    mixin: 'select',
    className: ['typeahead'],
    labelClassName: 'govuk-!-margin-bottom-4',
    validate: ['required', excludeUK],
    options: [{
      value: '',
      label: 'fields.country-of-nationality.options.none_selected'
    }].concat(countries.filter(country => country.value !== 'United Kingdom'))
  },
  dob: dateComponent('dob', {
    mixin: 'input-date',
    validate: [
      'required',
      'date',
      { type: 'before', arguments: ['0', 'days'] }
    ],
    legend: {
      className: 'govuk-!-margin-bottom-4'
    }
  })
};
