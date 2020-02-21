import GuthubAuth from "./github";
import Repository from "./repo";
import chalk from "chalk";

const github = new GuthubAuth();

const getGithubToken = async (): Promise<string> => {
  // Fetch token from config store
  let token = github.getStoredGithubToken();
  if (token) {
    return token;
  }

  // No token found, use credentials to access GitHub account
  token = await github.getPersonalAccesToken();

  return token;
};

const run = async () => {
  try {
    const token = await getGithubToken();

    github.githubAuth(token);

    const repo = new Repository(github.getInstance());

    const url = await repo.createRemoteRepo();

    await repo.createGitignore();

    await repo.setupRepo(url);
  } catch (err) {
    if (err) {
      switch (err.status) {
        case 401:
          console.log(
            chalk.red(
              "Couldn't log you in. Please provide correct credentials/token."
            )
          );
          break;
        case 422:
          console.log(
            chalk.red(
              "There is already a remote repository or token with the same name"
            )
          );
          break;
        default:
          console.log(chalk.red(err));
      }
    }
  }
};

run();
