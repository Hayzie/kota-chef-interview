export const truncateString = (str: string, maxLength = 6) => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};
