const { ApplicationError } = require('./errorHandling');

/**
 * Remove punctuation from phone number, truncate, and
 * add wildcards to match a myriad of formats in Salesforce.
 * @param {string} phone
 */
function normalizeAndEnwildPhoneNumber(phone) {
  phone = phone.replace(/\D/, ''); // remove all non-digit characters
  // use only last 10 digits.
  // Unsure of when it would be longer than 10 digits,
  // but the original code did this.
  // Probably assuming and excluding a +1 country code.
  phone = phone.slice(-10);

  // salesforce phone fields might have parentheses, dashes, or dots. We need to use wildcards to account for any of these cases.
  // i.e. for the phone number 123-456-7890, search for '%123%456%7890'. This will match '1234567890' and '(123) 456-7890' and '123.456.7890'
  return `%${phone.slice(0, 3)}%${phone.slice(3,6)}%${phone.slice(6)}`;
}
