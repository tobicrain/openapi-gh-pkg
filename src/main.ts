import * as core from "@actions/core";
import * as path from "path";
import * as fs from "fs";
import GithubService from "./services/GithubService";
import Constants from "./util/constants";
const { exec } = require('child_process');


const distributionManagement = `
    <distributionManagement>
        <repository>
            <id>github</id>
            <name>GitHub tandamo Apache Maven Packages</name>
            <url>https://maven.pkg.github.com/tandamo/scanq-client-api</url>
        </repository>
    </distributionManagement>
</project>
`;

const properties = `
    <spring-boot.repackage.skip>true</spring-boot.repackage.skip>
  </properties>`;

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
    exec(`npx @openapitools/openapi-generator-cli generate -i ${openApiFile} -g kotlin-spring -o ${__dirname}/kotlin --git-user-id "tandamo" --git-repo-id "scanq-client-api" --additional-properties=delegatePattern=true,apiPackage=de.scanq.client.api,artifactId=scanq-client-api,basePackage=de.scanq,artifactVersion=0.1.15,packageName=de.scanq,title=scanq-client-api`, (_error: any, _stdout: any, _stderr: any) => {
      readDir();
      // open file at path __dirname + /kotlin/pom.xml
      fs.readFile(__dirname + '/kotlin/pom.xml', 'utf8', function (err, data) {
        if (err) {
          return console.log(err);
        }
        const newData = data
          .replace("</project>", distributionManagement)
          .replace("</properties>", properties)

        console.log(newData);

        fs.writeFile(__dirname + '/kotlin/pom.xml', newData, 'utf8', function (err) {
          if (err) return console.log(err);
          console.log('pom.xml updated');
          exec('echo "<settings><servers><server><id>github</id><username>${GITHUB_USERNAME}</username><password>${GITHUB_TOKEN}</password></server></servers></settings>" > ~/.m2/settings.xml', (error2: any, stdout2: any, stderr2: any) => {
            console.log(stdout2);
            console.log(stderr2);
            exec(`cd ${__dirname}/kotlin; mvn deploy`, (_error: any, _stdout: any, _stderr: any) => {
              console.log(_stdout);
              console.log(_stderr);
              console.log("DONE")
            });
          });
        });
      });
    });
  } catch (error) {

    core.error(JSON.stringify(error));
  }
})();