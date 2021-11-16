export const capitalizeEachFirstLetter = (words) => words.replace(/(\w+)/g, (v, captureGroup) => {
  const firstLetter = captureGroup.slice(0, 1).toUpperCase();
  const restOfLetters = captureGroup.slice(1, captureGroup.length).toLowerCase();
  return firstLetter + restOfLetters;
});

export default capitalizeEachFirstLetter;
