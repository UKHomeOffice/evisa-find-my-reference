const hof = require('hof');
const Summary = hof.components.summary;
const clearSession = require('./behaviours/clear-session');

module.exports = {
  name: 'fmr',
  baseUrl: '/',
  params: '/:action?/:id?/:edit?',
  confirmStep: '/check-answers',
  steps: {
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
      backLink: ' ' // workaround to show Back link to the root of the app
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
      fields: []
    },
    '/any-other-information': {
      next: '/contact',
      fields: []
    },
    '/contact': {
      next: '/someone-else',
      fields: []
    },
    '/someone-else': {
      next: '/check-answers',
      fields: []
    },
    '/check-answers': {
      next: '/request-sent',
      fields: [],
      behaviours: [Summary, clearSession]
    },
    '/request-sent': {
    }
  }
};
