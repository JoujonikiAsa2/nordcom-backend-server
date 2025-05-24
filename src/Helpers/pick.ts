export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K[]
) => {
  const filteredObj: Partial<T> = {};
  key.forEach((key) => {
    if (obj && obj.hasOwnProperty.call(obj, key)) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
};
