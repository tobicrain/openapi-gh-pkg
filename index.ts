import github from '@actions/github';
import core from '@actions/core';

(
  async () => {
    // get file from repo in the same workflow on github actions
    // const octokit = github.getOctokit(core.getInput('token'));
    // const { data } = await octokit.rest.repos.getContent({
    //   owner: github.context.repo.owner,
    //   repo: github.context.repo.repo,
    //   path: core.getInput('path'),
    // });
    console.log(core.getInput('openapi'));
      
    core.notice("Calling our action");
  }
)();


// npx @openapitools/openapi-generator-cli generate -i api.yaml -g kotlin-spring -o kotlin --git-user-id "tandamo" --git-repo-id "scanq-client-api" --additional-properties=delegatePattern=true,apiPackage=de.scanq.client-api,artifactId=scanq-client-api,basePackage=de.scanq,artifactVersion=0.1.15,packageName=de.scanq,title=scanq-client-api