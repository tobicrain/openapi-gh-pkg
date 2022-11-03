import * as core from "@actions/core";
import GithubService from "./services/GithubService";
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const openApiPath = core.getInput(Constants.OPEN_API_FILE_PATH);
    const fileContent = await GithubService.content(openApiPath);
    // write file to current folder
    console.log("ijgiotfjhof")
    fs.writeFileSync("openapi.yaml", fileContent);
    console.log("auwdhiaw")
    const { exec } = require('child_process');
    console.log("jrutzr")
    const hello = exec('npx @openapitools/openapi-generator-cli generate -i openapi.yaml -g kotlin-spring -o kotlin --git-user-id "tandamo" --git-repo-id "scanq-client-api" --additional-properties=delegatePattern=true,apiPackage=de.scanq.client-api,artifactId=scanq-client-api,basePackage=de.scanq,artifactVersion=0.1.15,packageName=de.scanq,title=scanq-client-api');
    console.log("gfhfgh")
    core.notice(hello);
  } catch (error) {

    core.error(JSON.stringify(error));
  }
})();