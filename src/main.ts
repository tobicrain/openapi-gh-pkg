import * as core from "@actions/core"
import * as github from "@actions/github"

async function getGithubFileContent(filePath: string): Promise<string> {
    const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN");
    const { data } = await github.getOctokit(GITHUB_TOKEN).rest.repos.getContent({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      path: filePath
    });
    const contentString = (data as any)?.content as string | null;
    if (contentString) {
      return Buffer.from(contentString, "base64").toString();
    } else {
      throw new Error(`Could not find file at ${filePath}`);
    }
}

(
  async () => {
    try {
      const openApiPath = "awod";
      const fileContent = await getGithubFileContent(openApiPath);
      core.notice(fileContent);
      core.notice("Calling our action");
    } catch (error) {
      core.error(JSON.stringify(error));
    }
  }
)();


// npx @openapitools/openapi-generator-cli generate -i api.yaml -g kotlin-spring -o kotlin --git-user-id "tandamo" --git-repo-id "scanq-client-api" --additional-properties=delegatePattern=true,apiPackage=de.scanq.client-api,artifactId=scanq-client-api,basePackage=de.scanq,artifactVersion=0.1.15,packageName=de.scanq,title=scanq-client-api