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
      template: 'start'
    },
    '/name': {
      next: '/sex',
      fields: []
    },
    '/sex': {
      next: '/nationality',
      fields: []
    },
    '/nationality': {
      next: '/date-birth/',
      fields: []
    },
    '/date-birth/': {
      next: '/upload-photo/',
      fields: []
    },
    '/upload-photo/': {
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
