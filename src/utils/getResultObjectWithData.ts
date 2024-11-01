export function getResultObjectWithData(
  data: any | any[],
): Record<string, any> {
  const result = { data: [] };
  if (data) {
    if (Array.isArray(data)) {
      result.data = [...data];
    } else {
      result.data = [data];
    }
  }
  return result;
}
