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
      fullwidth: true,
      isNeedHelpHidden: true
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
      next: '/request-sent'
    },
    '/request-sent': {
    }
  }
};
