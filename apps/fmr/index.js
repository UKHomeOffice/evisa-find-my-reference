const hof = require('hof');
const Summary = hof.components.summary;
const SaveDocument = require('./behaviours/save-document');
const RemoveDocument = require('./behaviours/remove-document');
const submitRequest = require('./behaviours/submit-request');
const { disallowIndexing } = require('../../config');

const steps = {
  '/': {
    next: '/name',
    fields: [],
    template: 'start',
    sidepanel: true,
    fullwidth: true
  },
  '/name': {
    next: '/sex',
    fields: ['given-names', 'surname'],
    showNeedHelp: true
  },
  '/sex': {
    next: '/nationality',
    fields: ['sex'],
    showNeedHelp: true
  },
  '/nationality': {
    next: '/date-birth',
    fields: ['country-of-nationality'],
    showNeedHelp: true
  },
  '/date-birth': {
    next: '/upload-photo',
    fields: ['dob'],
    showNeedHelp: true
  },
  '/upload-photo': {
    next: '/any-other-information',
    behaviours: [SaveDocument('identity-documents', 'file-upload'), RemoveDocument('identity-documents')],
    fields: ['file-upload'],
    showNeedHelp: true
  },
  '/any-other-information': {
    next: '/contact',
    fields: ['anything-else'],
    showNeedHelp: true
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
    ],
    showNeedHelp: true
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
    ],
    showNeedHelp: true
  },
  '/someone-else-details': {
    next: '/check-answers',
    fields: [
      'someone-else-name',
      'someone-else-email',
      'someone-else-type'
    ],
    showNeedHelp: true
  },
  '/check-answers': {
    behaviours: [Summary, submitRequest],
    sections: require('./sections/summary-data-sections'),
    template: 'summary',
    next: '/request-sent',
    showNeedHelp: true
  },
  '/request-sent': {
    clearSession: true,
    backLink: false
  }
};

const pages = {
  '/accessibility': 'static/accessibility'
};

if (disallowIndexing) {
  pages['/robots.txt'] = 'static/robots';
}

module.exports = {
  name: 'fmr',
  baseUrl: '/',
  params: '/:action?/:id?/:edit?',
  confirmStep: '/check-answers',
  steps: steps,
  pages: pages
};
