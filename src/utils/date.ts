// use GMT from systems's setting
export const DATE = {
  ONLY_DATE: (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 2),
  END_DATE: (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 2),
};
