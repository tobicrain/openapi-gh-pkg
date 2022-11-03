"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@actions/core"));
(async () => {
    // get file from repo in the same workflow on github actions
    // const octokit = github.getOctokit(core.getInput('token'));
    // const { data } = await octokit.rest.repos.getContent({
    //   owner: github.context.repo.owner,
    //   repo: github.context.repo.repo,
    //   path: core.getInput('path'),
    // });
    try {
        const openApiFile = core_1.default.getInput("open_api_file");
        console.log(openApiFile);
        core_1.default.notice("Calling our action");
    }
    catch (error) {
        console.error(error);
    }
})();
// npx @openapitools/openapi-generator-cli generate -i api.yaml -g kotlin-spring -o kotlin --git-user-id "tandamo" --git-repo-id "scanq-client-api" --additional-properties=delegatePattern=true,apiPackage=de.scanq.client-api,artifactId=scanq-client-api,basePackage=de.scanq,artifactVersion=0.1.15,packageName=de.scanq,title=scanq-client-api
