//TODO add error codes and change the function of creating error text
type ConditionString = Record<string, string | number | Date>;

export const MSG = {
  ERR: {
    VALIDATION: {
      array: (fieldName: string): string => {
        return `${fieldName} must be an array`;
      },
      decimal: (fieldName: string): string => {
        return `${fieldName} must be a decimal number with up to 2 decimal places`;
      },
      email: (fieldName: string): string => {
        return `${fieldName} must be a valid email address`;
      },
      number: (fieldName: string): string => {
        return `${fieldName} must be a decimal number`;
      },
    },
    MESSAGES: {
      conflictException: (condition: ConditionString): string => {
        const [key, value] = Object.entries(condition)[0];
        return `Record with ${key} ${value} already exists.`;
      },
      notFoundException: (condition: ConditionString): string => {
        const [key, value] = Object.entries(condition)[0];
        return `Record with ${key} ${value} does not exist.`;
      },
      notImplementedException: (condition: ConditionString): string => {
        const [key, value] = Object.entries(condition)[0];
        return `Not Implemented. ${key} ${value} is error.`;
      },
      unauthorizedException: {
        invalidApiKey: 'Invalid API key',
        apiKeyIsMissing: 'API key is missing',
      },

      isBonusEnoughToPay: 'Insufficient bonus amount on the account',
    },
  },
};
