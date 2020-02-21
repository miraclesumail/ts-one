import CLI from "clui";
import fs from "fs";
import Git from "simple-git/promise";
import touch from "touch";
import _ from "lodash";
import * as inquirer from "./inquirer";
const git = Git();
const Spinner = CLI.Spinner;

export default class Repository {
  private gitInstance: any;

  public constructor(gitInstance: any) {
    this.gitInstance = gitInstance;
  }

  /**
     * 创建远程仓库
     */
  public async createRemoteRepo() {
    const answers = await inquirer.askRepoDetails();

    const data = {
      name: answers.name,
      description: answers.description,
      private: answers.visibility === "private"
    };

    const status = new Spinner("Creating remote repository...");
    status.start();

    try {
      const response = await this.gitInstance.repos.createForAuthenticatedUser(
        data
      );
      return response.data.ssh_url;
    } finally {
      status.stop();
    }
  }

  public async createGitignore() {
    const filelist = _.without(fs.readdirSync("."), ".git", ".gitignore");

    if (filelist.length) {
      const answers = await inquirer.askIgnoreFiles(filelist);

      if (answers.ignore.length) {
        fs.writeFileSync(".gitignore", answers.ignore.join("\n"));
      } else {
        touch(".gitignore");
      }
    } else {
      touch(".gitignore");
    }
  }

  public async setupRepo(url: string) {
    const status = new Spinner(
      "Initializing local repository and pushing to remote..."
    );
    status.start();

    try {
      git
        .init()
        // @ts-ignore
        .then(git.add(".gitignore"))
        .then(git.add("./*"))
        .then(git.commit("Initial commit"))
        .then(git.addRemote("origin", url))
        .then(git.push("origin", "master"));
    } finally {
      status.stop();
    }
  }
}
