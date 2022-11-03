const fs = require('fs');
const path = require('path');

// open local file
const file = fs.createReadStream(path.join(__dirname, 'api.yaml'));
// save filecontent in a variable
let fileContent = '';
file.on('data', (chunk) => {
    fileContent += chunk;
});
file.on('end', () => {
    // parse filecontent
    fs.writeFileSync("openapi.yml", fileContent);
    console.log(fileContent)
});

// execute npx command
// const { exec } = require('child_process');
// const npx = exec('npx @openapitools/openapi-generator-cli generate -i api.yaml -g kotlin-spring -o kotlin --git-user-id "tandamo" --git-repo-id "scanq-client-api" --additional-properties=delegatePattern=true,apiPackage=de.scanq.client-api,artifactId=scanq-client-api,basePackage=de.scanq,artifactVersion=0.1.15,packageName=de.scanq,title=scanq-client-api');
