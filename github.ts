import CLI from "clui";
import Configstore from "configstore";
import Octokit from "@octokit/rest";
import { createBasicAuth } from "@octokit/auth-basic";
import * as inquirer from "./inquirer";

const Spinner = CLI.Spinner;

export default class GuthubAuth {
  private octokit: any;
  private conf = new Configstore("pkg.name");

  public getInstance() {
    return this.octokit;
  }

  public getStoredGithubToken() {
    return this.conf.get("github.token");
  }

  public githubAuth(token: string) {
    // @ts-ignore
    this.octokit = new Octokit({
      auth: token
    });
  }

  /**
   * 
   */
  public async getPersonalAccesToken() {
    const credentials = await inquirer.askGithubCredentials();
    const status = new Spinner('Authenticating you, please wait...');

    status.start();

    const auth: () => Promise<any> = createBasicAuth({
      username: credentials.username,
      password: credentials.password,
      async on2Fa() {
        status.stop();
        const res = await inquirer.getTwoFactorAuthenticationCode();
        status.start();
        return res.twoFactorAuthenticationCode;
      },
      token: {
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'ginit, the command-line tool for initalizing Git repos'
      }
    });

    try {
      const res = await auth();

      if(res.token) {
        this.conf.set('github.token', res.token);
        return res.token;
      } else {
        throw new Error("GitHub token was not found in the response");
      }
    } finally {
      status.stop();
    }
  }
}
