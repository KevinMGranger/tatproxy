const { ApplicationError } = require('./errorHandling');

/**
 * Check if the given code is a valid special code.
 * "Special Codes" are tracked in firebase instead of salesforce.
 * @param firebase
 * @param {string} code
 */
async function checkSpecialCode(firebase, code) {
  const registrationCodes = await firebase.getReference('registration-codes');
  switch (code) {
    case registractionCodes['individual-volunteer-distributors']:
      return {
        success: true,
        volunteerType: 'volunteerDistributor',
        isIndividualDistributor: true
      };
    case registrationCodes['tat-ambassadors']:
      return {
        success: true,
        volunteerType: 'ambassadorVolunteer'
      };
  }
}

/**
 * Check if the given code is a valid regular code.
 * Regular codes are tracked in salesforce.
 * @param {*} salesforce
 * @param {string} code
 */
async function checkRegularCode(salesforce, code) {
  // TODO: get from salesforce
  // Unsure what the interface would look like for this query.
  const records = [];

  if (records.length === 0) {
    throw new ApplicationError({
      message: 'The registration code was incorrect.',
      errorCode: 'INCORRECT_REGISTRATION_CODE'
    });
  }

  // TODO: we should eventually check that there was only 1 record,
  // but the original code did not.
  const accountId = records[0].Id;

  // TODO: get from salesforce
  // Unsure what the interface would look like for this query.
  // The result is an object with FirstName, LastName, and Id.
  // The original code converts it to a nicer object with
  // name, salesforceId
  const coordinators = [];

  return {
    success: true,
    accountId: accountId,
    volunteerType: 'volunteerDistributor',
    isIndividualDistributor: false,
    teamCoordinators: coordinators
  };
}

class CombinedCodeChecker {
  constructor(firebase, salesforce) {
    this.specialCodeChecker = checkSpecialCode.bind(null, firebase);
    this.regularCodeChecker = checkRegularCode.bind(null, salesforce);
  }

  async check(code) {
    return (
      (await this.specialCodeChecker(code)) ||
      (await this.regularCodeChecker(code))
    );
  }
}

module.exports = {
  checkSpecialCode,
  checkRegularCode,
  CombinedCodeChecker
};
