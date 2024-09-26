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

module.exports = {
  identity: {
    isPageHeading: true,
    mixin: 'radio-group',
    validate: ['required'],
    options: [
      {
        value: 'yes'
      },
      {
        value: 'no'
      }
    ],
    className: ['govuk-radios', 'govuk-radios--inline'],
    legend: {
      className: 'govuk-!-margin-bottom-6'
    }
  },
  'identity-reason': {
    isPageHeading: true,
    mixin: 'textarea',
    validate: [
      'required',
      { type: 'maxlength', arguments: 500 }
    ],
    attributes: [{ attribute: 'rows', value: 5 }],
    labelClassName: 'govuk-!-margin-bottom-6'
  },
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
    validate: ['required'],
    options: [{
      value: '',
      label: 'fields.country-of-nationality.options.none_selected'
    }].concat(countries)
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
  }),
  'anything-else': {
    mixin: 'textarea',
    attributes: [{ attribute: 'rows', value: 5 }],
    validate: [
      { type: 'maxlength', arguments: 500 }
    ],
    labelClassName: 'govuk-!-margin-bottom-6',
    isPageHeading: true
  },
  'how-to-contact-you': {
    mixin: 'radio-group',
    validate: ['required'],
    options: [
      {
        value: 'email',
        toggle: 'email',
        child: 'input-text'
      },
      {
        value: 'uk-address',
        toggle: 'address-details-fieldset',
        child: 'partials/address-details'
      }
    ],
    legend: {
      className: 'govuk-!-margin-bottom-6'
    }
  },
  email: {
    mixin: 'input-text',
    validate: [
      'required',
      'email',
      { type: 'maxlength', arguments: 254 }
    ],
    dependent: {
      field: 'how-to-contact-you',
      value: 'email'
    }
  },
  'address-line-1': {
    mixins: 'input-text',
    validate: ['required'],
    dependent: {
      field: 'how-to-contact-you',
      value: 'uk-address'
    }
  },
  'address-line-2': {
    mixins: 'input-text'
  },
  'town-or-city': {
    mixins: 'input-text',
    validate: ['required'],
    dependent: {
      field: 'how-to-contact-you',
      value: 'uk-address'
    }
  },
  county: {
    mixins: 'input-text',
    className: ['govuk-input', 'govuk-!-width-two-thirds']
  },
  postcode: {
    mixins: 'input-text',
    formatter: ['ukPostcode'],
    validate: ['required', 'postcode'],
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    dependent: {
      field: 'how-to-contact-you',
      value: 'uk-address'
    }
  },
  'someone-else': {
    isPageHeading: 'true',
    mixin: 'radio-group',
    validate: 'required',
    options: [
      {
        value: 'yes'
      },
      {
        value: 'no'
      }
    ],
    className: ['govuk-radios', 'govuk-radios--inline']
  },
  'someone-else-name': {
    mixin: 'input-text',
    validate: ['required', validateText],
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    labelClassName: 'govuk-label--s'
  },
  'someone-else-email': {
    mixin: 'input-text',
    validate: [
      'required',
      'email',
      { type: 'maxlength', arguments: 254 }
    ],
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    labelClassName: 'govuk-label--s'
  },
  'someone-else-type': {
    mixin: 'radio-group',
    validate: 'required',
    options: [
      { value: 'sponsor' },
      { value: 'legal-representative' },
      { value: 'friend-or-relative' },
      { value: 'support-organisation' }
    ]
  }
};
