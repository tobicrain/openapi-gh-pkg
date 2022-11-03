import * as github from "@actions/github"
import * as core from "@actions/core"
import Constants from "../util/constants";

export default class GithubService {
    
    static async content(path: string) {
        const file = await this.file(path);
        const contentString = (file as any)?.content as string | null;
        if (contentString) {
           return Buffer.from(contentString, "base64").toString();
        } else {
            throw new Error(`Could not find file at ${path}`);
        }
    }

    static async file(path: string) {
        const GITHUB_TOKEN = core.getInput(Constants.GITHUB_TOKEN);
        const { data } = await github.getOctokit(GITHUB_TOKEN).rest.repos.getContent({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            path: path
        });
        return data;
    }

}