const { formatDate} = require('../../../utils');

module.exports = {
  'personal-details': {
    steps: [
      {
        step: '/identity',
        field: 'identity'
      },
      {
        step: '/identity-reason',
        field: 'identity-reason'
      },
      {
        step: '/name',
        field: 'given-names'
      },
      {
        step: '/name',
        field: 'surname'
      },
      {
        step: '/sex',
        field: 'sex'
      },
      {
        step: '/nationality',
        field: 'country-of-nationality'
      },
      {
        step: '/date-birth',
        field: 'dob',
        parse: val => formatDate(val)
      },
      {
        step: '/upload-photo',
        field: 'identity-documents',
        parse: documents => {
          return Array.isArray(documents) && documents.length > 0  ? documents.map(doc => doc.name).join('\n') : null;
        }
      },
      {
        step: '/any-other-information',
        field: 'anything-else'
      },
      {
        step: '/contact',
        field: 'how-to-contact-you'
      },
      {
        step: '/contact',
        field: 'contact-details',
        parse: (val, req) => {
          if (req.sessionModel.get('how-to-contact-you') === 'email') {
            return req.sessionModel.get('email');
          }

          const formattedAddress = Array(
            req.sessionModel.get('address-line-1'),
            req.sessionModel.get('address-line-2'),
            req.sessionModel.get('town-or-city'),
            req.sessionModel.get('county'),
            req.sessionModel.get('postcode')
          ).filter(x => x).join('\n');

          req.sessionModel.set('formatted-address', formattedAddress);
          return formattedAddress;
        }
      },
      {
        step: '/someone-else',
        field: 'someone-else'
      }
    ]
  },
  'completing-for-someone-else': {
    steps: [
      {
        step: '/someone-else-details',
        field: 'someone-else-name'
      },
      {
        step: '/someone-else-details',
        field: 'someone-else-email'
      },
      {
        step: '/someone-else-details',
        field: 'someone-else-type'
      }
    ]
  }
};
