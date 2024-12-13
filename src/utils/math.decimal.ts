import { FIELDS_LENGTH } from '@src/db/const-fields';

export const MATH = {
  DECIMAL: {
    add: (value1: string, value2: string) => {
      const result = parseFloat(value1) + parseFloat(value2);

      return result.toFixed(FIELDS_LENGTH.DECIMAL.SCALE);
    },
    subtract: (value1: string, value2: string) => {
      const result = parseFloat(value1) - parseFloat(value2);

      return result.toFixed(FIELDS_LENGTH.DECIMAL.SCALE);
    },
    round: (value: number) => {
      return Number(value.toFixed(FIELDS_LENGTH.DECIMAL.SCALE));
    },
  },
};
