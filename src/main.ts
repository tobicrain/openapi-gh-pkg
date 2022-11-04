import * as core from "@actions/core";
import * as github from "@actions/github";
import * as path from "path";
import * as fs from "fs";
import GithubService from "./services/GithubService";
import Constants from "./util/constants";
const { exec } = require('child_process');
const yaml = require('js-yaml');

const repoName = github.context.repo.repo as string;
const owner = github.context.repo.owner as string;

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
    core.notice("github.context.repo"+ repoName);
    
    const openApiPath = core.getInput(Constants.OPEN_API_FILE_PATH);
    core.notice(`OpenAPI file path: ${openApiPath}`);
    
    const fileContent = await fs.promises.readFile(openApiPath, 'utf8')
    core.notice(`OpenAPI file content: ${fileContent}`);

    const doc = yaml.load(fileContent);
    
    const version = doc.info.version;
    core.notice(`OpenAPI version: ${version}`);
    
    const dottedArtifactId = repoName.replace(/-/g, '.');
    const firstArtifactId = dottedArtifactId.split('.')[0];

    console.log(`npx @openapitools/openapi-generator-cli generate -i ${openApiPath} -g kotlin-spring -o kotlin --git-user-id "${owner}" --git-repo-id "${repoName}" --additional-properties=delegatePattern=true,apiPackage=de.${dottedArtifactId},artifactId=${repoName},basePackage=de.${firstArtifactId},artifactVersion=${version},packageName=de.${firstArtifactId},title=${repoName}`)
    const { stdout, stderr } = await exec(`npx @openapitools/openapi-generator-cli generate -i ${openApiPath} -g kotlin-spring -o kotlin --git-user-id "${owner}" --git-repo-id "${repoName}" --additional-properties=delegatePattern=true,apiPackage=de.${dottedArtifactId},artifactId=${repoName},basePackage=de.${firstArtifactId},artifactVersion=${version},packageName=de.${firstArtifactId},title=${repoName}`);
    readDir();
    const data = await fs.promises.readFile('/kotlin/pom.xml', 'utf8')
    console.log(data)
    // // exec(, (_error: any, _stdout: any, _stderr: any) => {
    // //   fs.readFile(__dirname + '/kotlin/pom.xml', 'utf8', function (err, data) {
    // //     if (err) {
    // //       return console.log(err);
    // //     }
    // //     const newData = data
    // //       .replace("</project>", distributionManagement)
    // //       .replace("</properties>", properties)

    // //     console.log(newData);

    // //     fs.writeFile(__dirname + '/kotlin/pom.xml', newData, 'utf8', function (err) {
    // //       if (err) return console.log(err);
    // //       console.log('pom.xml updated');
    // //       const GITHUB_USERNAME = core.getInput(Constants.GITHUB_USERNAME);
    // //       const GITHUB_TOKEN = core.getInput(Constants.GITHUB_TOKEN);
    // //       fs.writeFile(__dirname + '/settings.xml', `<settings><servers><server><id>github</id><username>${GITHUB_USERNAME}</username><password>${GITHUB_TOKEN}</password></server></servers></settings>`, 'utf8', function (err) {
    // //         if (err) return console.log(err);
    // //         console.log('settings.xml updated');
    // //         readDir();
    // //         exec(`cd ${__dirname}/kotlin; mvn deploy --settings ${__dirname}/settings.xml -DskipTests`, (error3: any, stdout3: any, stderr3: any) => {
    // //           console.log(`stdout3: ${stdout3}`);
    // //           console.log(`stderr3: ${stderr3}`);
    // //           if (error3) {
    // //             console.log(`error3: ${error3.message}`);
    // //             return;
    // //           }
    // //         });
    // //       });
    // //     });
    // //   });
    // // });
  } catch (error) {
    console.error(error);
    core.error(JSON.stringify(error));
  }
})();