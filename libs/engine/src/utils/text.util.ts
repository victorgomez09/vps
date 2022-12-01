export const removeLineBreaker = (text: string): string => {
  return text.replace(/(\r\n|\n|\r)/gm, '');
};
