

function getRepoUrlFromFilePath(githubFilePath) {
    const filePathPattern = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.*)/;
    const repoPattern = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/?/;
    
    let match = githubFilePath.match(filePathPattern);
    if (match) {
      const [fullMatch, user, repo, branch, filePath] = match;
      const repoUrl = `https://github.com/${user}/${repo}`;
      return {
        type: 'file',
        user,
        repo,
        branch,
        filePath,
        repoUrl
      };
    }
  
    match = githubFilePath.match(repoPattern);
    if (match) {
      const [fullMatch, user, repo] = match;
      const repoUrl = `https://github.com/${user}/${repo}`;
      return {
        type: 'repo',
        user,
        repo,
        repoUrl
      };
    }
  
    throw new Error("Invalid GitHub URL");
}

  export default getRepoUrlFromFilePath;
  
  /*

  // Example usage:
  const githubFilePath1 = "https://github.com/user/repo/blob/main/path/to/file.js";
  const githubFilePath2 = "https://github.com/user/repo";
  const githubFilePath3 = "https://github.com/user/repo/";
  
  console.log(getRepoUrlFromFilePath(githubFilePath1)); 
  // Outputs: { type: 'file', user: 'user', repo: 'repo', branch: 'main', filePath: 'path/to/file.js', repoUrl: 'https://github.com/user/repo' }
  
  console.log(getRepoUrlFromFilePath(githubFilePath2)); 
  // Outputs: { type: 'repo', user: 'user', repo: 'repo', repoUrl: 'https://github.com/user/repo' }
  
  console.log(getRepoUrlFromFilePath(githubFilePath3)); 
  // Outputs: { type: 'repo', user: 'user', repo: 'repo', repoUrl: 'https://github.com/user/repo' }

  */