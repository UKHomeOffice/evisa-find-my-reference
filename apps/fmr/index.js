const hof = require('hof');
const Summary = hof.components.summary;
const SaveDocument = require('./behaviours/save-document');
const RemoveDocument = require('./behaviours/remove-document');

module.exports = {
  name: 'fmr',
  baseUrl: '/',
  params: '/:action?/:id?/:edit?',
  confirmStep: '/check-answers',
  steps: {
    '/': {
      next: '/identity',
      fields: [],
      template: 'start',
      sidepanel: true,
      fullwidth: true,
      isNeedHelpHidden: true
    },
    '/identity': {
      next: '/name',
      fields: ['identity'],
      forks: [
        {
          target: '/identity-reason',
          condition: {
            field: 'identity',
            value: 'no'
          }
        }
      ],
      backLink: ' ' // workaround to show Back link to the root of the app
    },
    '/identity-reason': {
      next: '/name',
      fields: ['identity-reason']
    },
    '/name': {
      next: '/sex',
      fields: ['given-names', 'surname']
    },
    '/sex': {
      next: '/nationality',
      fields: ['sex']
    },
    '/nationality': {
      next: '/date-birth',
      fields: ['country-of-nationality']
    },
    '/date-birth': {
      next: '/upload-photo',
      fields: ['dob']
    },
    '/upload-photo': {
      next: '/any-other-information',
      behaviours: [SaveDocument('identity-documents', 'file-upload'), RemoveDocument('identity-documents')],
      fields: ['file-upload']
    },
    '/any-other-information': {
      next: '/contact',
      fields: ['anything-else']
    },
    '/contact': {
      next: '/someone-else',
      fields: [
        'how-to-contact-you',
        'email',
        'address-line-1',
        'address-line-2',
        'town-or-city',
        'county',
        'postcode'
      ]
    },
    '/someone-else': {
      next: '/check-answers',
      fields: ['someone-else'],
      forks: [
        {
          target: '/someone-else-details',
          condition: {
            field: 'someone-else',
            value: 'yes'
          }
        }
      ]
    },
    '/someone-else-details': {
      next: '/check-answers',
      fields: [
        'someone-else-name',
        'someone-else-email',
        'someone-else-type'
      ]
    },
    '/check-answers': {
      behaviours: [Summary],
      sections: require('./sections/summary-data-sections'),
      template: 'summary',
      next: '/request-sent'
    },
    '/request-sent': {
      clearSession: true,
      backLink: false,
      isNeedHelpHidden: true
    }
  }
};
