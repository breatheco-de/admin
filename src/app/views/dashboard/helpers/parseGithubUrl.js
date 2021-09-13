export const parseGithubUrl = (str) => {
  const regex = /(?:https:\/\/)?(?:www)?github\.com\/([a-zA-Z0-9_-]+)/gm;
  let m;
  let username = '';

  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      username = match;
    });
  }
  return username;
};
