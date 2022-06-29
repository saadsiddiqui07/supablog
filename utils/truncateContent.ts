export const truncateContent = (str: string, lenStr: number): string => {
  return str?.length > lenStr ? str.slice(0, lenStr - 1) + "..." : str;
};
