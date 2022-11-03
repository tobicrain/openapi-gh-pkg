import * as core from "@actions/core";
import * as path from "path";
import * as fs from "fs";
import GithubService from "./services/GithubService";
import Constants from "./util/constants";
const { exec } = require('child_process');


function readDir() {
  exec(`ls`, (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
    } else {
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout2: ${stdout}`);
      console.log(`stderr2: ${stderr}`);
    }
  })
  // list files in current directory
  exec(`cd ${__dirname}; ls`, (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
    } else {
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    }
  })
}

(async () => {
  try {
    core.notice("Hello World!");
    
    const openApiPath = core.getInput(Constants.OPEN_API_FILE_PATH);
    core.notice(`OpenAPI file path: ${openApiPath}`);
    
    const fileContent = await GithubService.content(openApiPath);
    
    const openApiFile = path.join(__dirname, 'openapi.yaml');
    fs.writeFileSync(openApiFile, fileContent);
    core.notice(`OpenAPI file saved to: ${openApiFile}`);
    readDir()
    exec(`npx @openapitools/openapi-generator-cli; npx @openapitools/openapi-generator-cli generate -i api.yaml -g kotlin-spring -o kotlin --git-user-id "tandamo" --git-repo-id "scanq-client-api" --additional-properties=delegatePattern=true,apiPackage=de.scanq.client-api,artifactId=scanq-client-api,basePackage=de.scanq,artifactVersion=0.1.15,packageName=de.scanq,title=scanq-client-api`, (error, stdout, stderr) => {

        readDir()

        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        console.log(`stdout: ${stdout}`);
    });
  } catch (error) {

    core.error(JSON.stringify(error));
  }
})();