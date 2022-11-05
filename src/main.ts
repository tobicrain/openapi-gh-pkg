import * as core from "@actions/core";
import * as github from "@actions/github";
import * as path from "path";
import * as fs from "fs";
import GithubService from "./services/GithubService";
import Constants from "./util/constants";
const { exec } = require('child_process');
const yaml = require('js-yaml');


const distributionManagement = (owner: string, repoName: string) => `
    <distributionManagement>
        <repository>
            <id>github</id>
            <name>GitHub ${owner} Apache Maven Packages</name>
            <url>https://maven.pkg.github.com/${owner}/${repoName}</url>
        </repository>
    </distributionManagement>
</project>
`;

async function execute (command: string): Promise<string> {
  return await new Promise(function (resolve, reject) {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        reject(err);
      }
      resolve(stdout);
    });
  });
}


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
    // Set all Input Parameters
    const githubUsername = core.getInput(Constants.GITHUB_USERNAME);
    const githubToken = core.getInput(Constants.GITHUB_TOKEN);
    const openApiPath = core.getInput(Constants.OPEN_API_FILE_PATH);

    const repoName = github.context.repo.repo as string;
    const ownerName = github.context.repo.owner as string;

    const dottedArtifactId = repoName.replace(/-/g, '.');
    const firstArtifactId = dottedArtifactId.split('.')[0];

    const ymlFile = await fs.promises.readFile(openApiPath, 'utf8')
    const yml = yaml.load(ymlFile);

    const version = yml.info.version;

    core.notice("Repository name: "+ repoName);
    core.notice("OpenAPI file path:"+ openApiPath);
    core.notice("OpenAPI version:"+ version);
    
    await execute(`npx @openapitools/openapi-generator-cli generate -i ${openApiPath} -g kotlin-spring -o kotlin --git-user-id "${ownerName}" --git-repo-id "${repoName}" --additional-properties=delegatePattern=true,apiPackage=de.${dottedArtifactId},artifactId=${repoName},basePackage=de.${firstArtifactId},artifactVersion=${version},packageName=de.${firstArtifactId},title=${repoName}`);
    core.notice(`Generated Kotlin Spring code`);

    const pomFile = await fs.promises.readFile('kotlin/pom.xml', 'utf8')

    const newPomFile = pomFile
      .replace("</project>", distributionManagement(ownerName, repoName))
      .replace("</properties>", properties)
    console.log(newPomFile);
    core.notice(`Updated pom.xml`);

    await fs.promises.writeFile('kotlin/pom.xml', newPomFile, 'utf8');
    core.notice(`Updated pom.xml`);

    fs.writeFile(__dirname + '/settings.xml', `<settings><servers><server><id>github</id><username>${githubUsername}</username><password>${githubToken}</password></server></servers></settings>`, 'utf8', function (err) {
      if (err) return console.log(err);
      console.log('settings.xml updated');
      readDir();
      exec(`cd ${__dirname}/kotlin; mvn deploy --settings ${__dirname}/settings.xml -DskipTests`, (error3: any, stdout3: any, stderr3: any) => {
        console.log(`stdout3: ${stdout3}`);
        console.log(`stderr3: ${stderr3}`);
        if (error3) {
          console.log(`error3: ${error3.message}`);
          return;
        }
      });



    });
  } catch (error) {
    console.error(error);
    core.error(JSON.stringify(error));
  }
})();