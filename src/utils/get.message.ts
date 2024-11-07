//TODO add error codes and change the function of creating error text

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
  },
};
