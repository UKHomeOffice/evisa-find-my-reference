const config = require('../../../config');
const {
  notifyApiKey,
  caseworkerEmail,
  userConfirmationTemplateId,
  businessConfirmationTemplateId,
  replyToId
} = config.govukNotify;

const {
  getLabel,
  formatDate,
  genNotifyErrorMsg,
  parseDocumentList,
  getFullName
} = require('../../../utils');

const NotifyClient = require('notifications-node-client').NotifyClient;
const Notify = new NotifyClient(notifyApiKey);

class EmailProps {
  constructor() {
    this.personalisation = {};
    if (replyToId) {
      this.emailReplyToId = replyToId;
    }
  }

  addPersonalisation(newPersonalisation) {
    Object.assign(this.personalisation, newPersonalisation);
  }
}

module.exports = superclass => class extends superclass {
  async successHandler(req, res, next) {
    try {
      const crs = await import('crypto-random-string');
      const uniqueRefNumber = crs.default({ length: 6, characters: 'ABCDEFGHJKMNPRTUVWXY0123456789' });
      req.sessionModel.set('uniqueRefNumber', `${config.uniqueRefNumberPrefix}${uniqueRefNumber}`);
    } catch (error) {
      const errorMsg = `Failed to generate unique reference number: ${error}`;
      req.log('error', errorMsg);
      return next(Error(errorMsg));
    }

    const businessEmailProps = new EmailProps;

    try {
      businessEmailProps.addPersonalisation({
        unique_ref_number: req.sessionModel.get('uniqueRefNumber'),
        has_given_names: req.sessionModel.get('given-names') ? 'yes' : 'no',
        given_names: req.sessionModel.get('given-names') ?
          req.sessionModel.get('given-names') : '',
        surname: req.sessionModel.get('surname'),
        identity: getLabel('identity', req.sessionModel.get('identity')),
        has_identity_reason: req.sessionModel.get('identity') === 'no' ? 'yes' : 'no',
        identity_reason: req.sessionModel.get('identity') === 'no' ? req.sessionModel.get('identity-reason') : '',
        date_of_birth: formatDate(req.sessionModel.get('dob')),
        nationality: req.sessionModel.get('country-of-nationality'),
        sex: getLabel('sex', req.sessionModel.get('sex')),
        identity_documents: parseDocumentList(req.sessionModel.get('identity-documents')),
        anything_else: req.sessionModel.get('anything-else') ?? 'none provided',
        how_to_contact_you: getLabel('how-to-contact-you', req.sessionModel.get('how-to-contact-you')),
        contact_details: req.sessionModel.get('how-to-contact-you') === 'email' ?
          req.sessionModel.get('email') : req.sessionModel.get('formatted-address'),
        someone_else: getLabel('someone-else', req.sessionModel.get('someone-else')),
        is_someone_else: req.sessionModel.get('someone-else'),
        someone_else_name: req.sessionModel.get('someone-else') === 'yes' &&
          req.sessionModel.get('someone-else-name') ?
          req.sessionModel.get('someone-else-name') : '',
        someone_else_email: req.sessionModel.get('someone-else') === 'yes' &&
          req.sessionModel.get('someone-else-email') ?
          req.sessionModel.get('someone-else-email') : '',
        someone_else_type: req.sessionModel.get('someone-else') === 'yes' && req.sessionModel.get('someone-else-type') ?
          getLabel('someone-else-type', req.sessionModel.get('someone-else-type')) : ''
      });

      await Notify.sendEmail(businessConfirmationTemplateId, caseworkerEmail, businessEmailProps);
      req.log('info', 'FMR request caseworker email sent successfully');
    } catch (error) {
      const errorMsg = `Failed to send FMR request caseworker email: ${genNotifyErrorMsg(error)}`;
      req.log('error', errorMsg);
      return next(Error(errorMsg));
    }

    const userContactEmail = req.sessionModel.get('email');

    if (userContactEmail) {
      const userEmailProps = new EmailProps;

      try {
        userEmailProps.addPersonalisation({
          full_name: getFullName(req.sessionModel.get('given-names'), req.sessionModel.get('surname')),
          unique_ref_number: req.sessionModel.get('uniqueRefNumber')
        });

        await Notify.sendEmail(userConfirmationTemplateId, userContactEmail, userEmailProps);
        req.log('info', 'FMR user acknowledgement email sent successfully');
      } catch (error) {
        const errorMsg = `Failed to send FMR user acknowledgement email: ${genNotifyErrorMsg(error)}`;
        req.log('error', errorMsg);
        return next(new Error(errorMsg));
      }
    }

    return super.successHandler(req, res, next);
  }
};
