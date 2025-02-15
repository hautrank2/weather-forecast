export const getValueFromPath = (obj: any, path: string[] | string): any => {
  if (typeof path === 'string') {
    return obj[path];
  }
  return path.reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : undefined;
  }, obj);
};
