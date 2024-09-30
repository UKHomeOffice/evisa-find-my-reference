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

module.exports = { getLabel, formatDate, sanitiseFilename };
