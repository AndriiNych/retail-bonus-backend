export const getQueryParamValueAsBoolean = (value: string): boolean => {
  return Boolean(value === 'true' || value === '');
};
