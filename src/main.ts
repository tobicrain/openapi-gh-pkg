import * as core from "@actions/core";
import * as github from "@actions/github";
import * as path from "path";
import * as fs from "fs";
import GithubService from "./services/GithubService";
import Constants from "./util/constants";
const { exec } = require('child_process');
const yaml = require('js-yaml');

const repoName = github.context.repo.repo;
const owner = github.context.repo.owner;

const distributionManagement = `
    <distributionManagement>
        <repository>
            <id>github</id>
            <name>GitHub ${owner} Apache Maven Packages</name>
            <url>https://maven.pkg.github.com/${owner}/${repoName}</url>
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
    core.notice("github.context.repo"+ github.context.repo);
    core.notice("Hello World!");
    
    const openApiPath = core.getInput(Constants.OPEN_API_FILE_PATH);
    core.notice(`OpenAPI file path: ${openApiPath}`);
    
    const fileContent = await GithubService.content(openApiPath);
    core.notice(`File content: ${fileContent}`);
    const doc = yaml.load(fileContent);
    
    const version = doc.info.version;
    console.log(version)
    core.notice(version)
    
    const openApiFile = path.join(__dirname, 'openapi.yaml');
    fs.writeFileSync(openApiFile, fileContent);
    core.notice(`OpenAPI file saved to: ${openApiFile}`);
    
    console.log(`npx @openapitools/openapi-generator-cli generate -i ${openApiFile} -g kotlin-spring -o ${__dirname}/kotlin --git-user-id "${owner}" --git-repo-id "${repoName}" --additional-properties=delegatePattern=true,apiPackage=de.${repoName.replace("-", ".")},artifactId=${repoName},basePackage=de.${repoName.replace("-", ".")},artifactVersion=${version},packageName=de.${repoName.split("-").at(0)},title=${repoName}`)
    const { stdout, stderr } = await exec(`npx @openapitools/openapi-generator-cli generate -i ${openApiFile} -g kotlin-spring -o ${__dirname}/kotlin --git-user-id "${owner}" --git-repo-id "${repoName}" --additional-properties=delegatePattern=true,apiPackage=de.${repoName.replace("-", ".")},artifactId=${repoName},basePackage=de.${repoName.replace("-", ".")},artifactVersion=${version},packageName=de.${repoName.split("-").at(0)},title=${repoName}`);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    // exec(, (_error: any, _stdout: any, _stderr: any) => {
    //   fs.readFile(__dirname + '/kotlin/pom.xml', 'utf8', function (err, data) {
    //     if (err) {
    //       return console.log(err);
    //     }
    //     const newData = data
    //       .replace("</project>", distributionManagement)
    //       .replace("</properties>", properties)

    //     console.log(newData);

    //     fs.writeFile(__dirname + '/kotlin/pom.xml', newData, 'utf8', function (err) {
    //       if (err) return console.log(err);
    //       console.log('pom.xml updated');
    //       const GITHUB_USERNAME = core.getInput(Constants.GITHUB_USERNAME);
    //       const GITHUB_TOKEN = core.getInput(Constants.GITHUB_TOKEN);
    //       fs.writeFile(__dirname + '/settings.xml', `<settings><servers><server><id>github</id><username>${GITHUB_USERNAME}</username><password>${GITHUB_TOKEN}</password></server></servers></settings>`, 'utf8', function (err) {
    //         if (err) return console.log(err);
    //         console.log('settings.xml updated');
    //         readDir();
    //         exec(`cd ${__dirname}/kotlin; mvn deploy --settings ${__dirname}/settings.xml -DskipTests`, (error3: any, stdout3: any, stderr3: any) => {
    //           console.log(`stdout3: ${stdout3}`);
    //           console.log(`stderr3: ${stderr3}`);
    //           if (error3) {
    //             console.log(`error3: ${error3.message}`);
    //             return;
    //           }
    //         });
    //       });
    //     });
    //   });
    // });
  } catch (error) {

    core.error(JSON.stringify(error));
  }
})();