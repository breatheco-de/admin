export const capitalizeTheFirstLetter = (words) => words.toLowerCase().replace(/(\w+)/, (v, captureGroup) => {
  const firstLetter = captureGroup.slice(0, 1).toUpperCase();
  const restOfLetters = captureGroup.slice(1, captureGroup.length).toLowerCase();
  return firstLetter + restOfLetters;
});

export default capitalizeTheFirstLetter;
