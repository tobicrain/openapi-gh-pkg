import * as core from "@actions/core"
import { promises as fsPromises } from 'fs';
import { join } from 'path';

async function asyncReadFile(filename: string) {
  try {
    const result = await fsPromises.readFile(
      join(__dirname, filename),
      'utf-8',
    );

    console.log(result); // 👉️ "hello world hello world ..."

    return result;
  } catch (err) {
    console.log(err);
    return 'Something went wrong'
  }
}

(
  async () => {
    // get file from repo in the same workflow on github actions
    // const octokit = github.getOctokit(core.getInput('token'));
    // const { data } = await octokit.rest.repos.getContent({
    //   owner: github.context.repo.owner,
    //   repo: github.context.repo.repo,
    //   path: core.getInput('path'),
    // });
    try {
      const openApiFile = core.getInput("open_api_file");
      const openApiFileContent = await asyncReadFile(openApiFile);
      console.log(openApiFileContent);
      core.notice("Calling our action");
    } catch (error) {
      console.error(error);
    }
  }
)();


// npx @openapitools/openapi-generator-cli generate -i api.yaml -g kotlin-spring -o kotlin --git-user-id "tandamo" --git-repo-id "scanq-client-api" --additional-properties=delegatePattern=true,apiPackage=de.scanq.client-api,artifactId=scanq-client-api,basePackage=de.scanq,artifactVersion=0.1.15,packageName=de.scanq,title=scanq-client-api