import * as core from "@actions/core";
import GithubService from "./services/GithubService";
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const openApiPath = core.getInput(Constants.OPEN_API_FILE_PATH);
    const fileContent = await GithubService.content(openApiPath);
    // write file to current folder
    fs.writeFileSync("openapi.yml", fileContent);
    const file = fs.createReadStream(path.join(__dirname, 'openapi.yml'));
    // save filecontent in a variable
    let fileContent2 = '';
    file.on('data', (chunk) => {
        fileContent2 += chunk;
    });
    file.on('end', () => {
        // parse filecontent
        fs.writeFileSync("openapi2.yml", fileContent2);
        console.log(fileContent2)
    });
    core.notice(fileContent2);
  } catch (error) {

    core.error(JSON.stringify(error));
  }
})();