const config = require('../config');
const translations = require('../apps/fmr/translations/src/en/fields.json');

/**
 * Retrieves the label for a given field key and field value from the translations object.
 *
 * @param {string} fieldKey - The key representing the field in the translations object.
 * @param {string|string[]} fieldValue - The value or values for which the label(s) need to be retrieved.
 * @returns {string|undefined} - The label(s) corresponding to the field value(s), or undefined if not found.
 */
const getLabel = (fieldKey, fieldValue) => {
  if ( Array.isArray(fieldValue)) {
    return fieldValue.map(option => translations[fieldKey]?.options[option]?.label).join(', ') || undefined;
  }
  return translations[fieldKey]?.options[fieldValue]?.label || undefined;
};

/**
 * Formats a given date string into a specified format.
 *
 * @param {string} date - The date string to be formatted.
 * @returns {string} - The formatted date string.
 *
 * @example
 * Assuming config.dateLocales is 'en-GB' and config.dateFormat is { day: '2-digit', month: '2-digit', year: 'numeric' }
 * formatDate('2023-10-01'); // returns '01 10 2023'
 */
const formatDate = date => {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat(config.dateLocales, config.dateFormat).format(dateObj).replace(/\//g, ' ');
};

/**
 * Sanitises a filename by replacing the middle part with **REDACTED**,
 * keeping the first 2 and last 2 characters before the extension.
 *
 * @param {string} filename - The original filename to be sanitised.
 * @returns {string} - The sanitised filename with the middle part replaced by **REDACTED**.
 *
 * @example
 * sanitiseFilename('filename.txt');
 * // returns 'fi**REDACTED**le.txt'
 *
 * @example
 * sanitiseFilename('abcdefghijklmnopqrstuvwxyz.jpg');
 * // returns 'ab**REDACTED**yz.jpg'
 */
const sanitiseFilename = filename => filename?.replace(/^(.{2}).*(.{2}\.[^.]+)$/, '$1**REDACTED**$2');

/**
 * Generates a useful error message from a typical GovUk Notify Node.js client error reponse object
 *
 * This function is relatively specific to Error objects created by notifications-node-client.
 * It will return at a minimum error.message from the Error object passed in.
 *
 * @param {object} error - An Error object.
 * @returns {string} - An error message for GovUK Notify containing key causal information.
 */
const genNotifyErrorMsg = error => {
  const errorDetails = error.response?.data ? `Cause: ${JSON.stringify(error.response.data)}` : '';
  const errorCode = error.code ? `${error.code} -` : '';
  return `${errorCode} ${error.message}; ${errorDetails}`;
};

/**
 * Parses a list of documents and returns a formatted string with each document's name and URL.
 *
 * @param {Array} documents - An array of document objects, each containing a `name` and `url` property.
 * @returns {string} - A formatted string with each document's name as a markdown link, separated by new lines.
 *
 * @example
 * // Input
 * const documents = [
 *   { name: 'Document 1', url: 'http://example.com/doc1' },
 *   { name: 'Document 2', url: 'http://example.com/doc2' }
 * ];
 *
 * // Output
 * // [Document 1](http://example.com/doc1)
 * // [Document 2](http://example.com/doc2)
 * const result = parseDocumentList(documents);
 * console.log(result);
 */
const parseDocumentList = documents => {
  return Array.isArray(documents) ? documents.map(doc => `[${doc.name}](${doc.url})`).join('\n') : '';
};

/**
 * Constructs a full name from given names and a surname.
 *
 * @param {string} givenNames - The given names (first and middle names).
 * @param {string} surname - The surname (last name).
 * @returns {string} - The full name, which is a combination of given names and surname.
 *
 * @example
 * // returns 'John Doe'
 * getFullName('John', 'Doe');
 *
 * @example
 * // returns 'Doe'
 * getFullName('', 'Doe');
 */
const getFullName = (givenNames, surname) => {
  const fullName = givenNames ? `${givenNames} ${surname}` : surname;
  return fullName;
};

module.exports = { getLabel,
  formatDate,
  sanitiseFilename,
  genNotifyErrorMsg,
  parseDocumentList,
  getFullName
};
