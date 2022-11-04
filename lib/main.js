"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const GithubService_1 = __importDefault(require("./services/GithubService"));
const constants_1 = __importDefault(require("./util/constants"));
const { exec } = require('child_process');
const yaml = require('js-yaml');
const repoName = github.context.repo.repo + "";
const owner = github.context.repo.owner + "";
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
            console.error(err);
        }
        else {
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout2: ${stdout}`);
            console.log(`stderr2: ${stderr}`);
        }
    });
    // list files in current directory
    exec(`cd ${__dirname}; ls`, (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err);
        }
        else {
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        core.notice("github.context.repo" + github.context.repo);
        core.notice("Hello World!");
        const openApiPath = core.getInput(constants_1.default.OPEN_API_FILE_PATH);
        core.notice(`OpenAPI file path: ${openApiPath}`);
        const fileContent = yield GithubService_1.default.content(openApiPath);
        core.notice(`File content: ${fileContent}`);
        const doc = yaml.load(fileContent);
        const version = doc.info.version;
        console.log(version);
        core.notice(version);
        const openApiFile = path.join(__dirname, 'openapi.yaml');
        fs.writeFileSync(openApiFile, fileContent);
        core.notice(`OpenAPI file saved to: ${openApiFile}`);
        console.log(`npx @openapitools/openapi-generator-cli generate -i ${openApiFile} -g kotlin-spring -o ${__dirname}/kotlin --git-user-id "${owner}" --git-repo-id "${repoName}" --additional-properties=delegatePattern=true,apiPackage=de.${repoName.replace("-", ".")},artifactId=${repoName},basePackage=de.${repoName.replace("-", ".")},artifactVersion=${version},packageName=de.${repoName.split("-")[0]},title=${repoName}`);
        const { stdout, stderr } = yield exec(`npx @openapitools/openapi-generator-cli generate -i ${openApiFile} -g kotlin-spring -o ${__dirname}/kotlin --git-user-id "${owner}" --git-repo-id "${repoName}" --additional-properties=delegatePattern=true,apiPackage=de.${repoName.replace("-", ".")},artifactId=${repoName},basePackage=de.${repoName.replace("-", ".")},artifactVersion=${version},packageName=de.${repoName.split("-")[0]},title=${repoName}`);
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
    }
    catch (error) {
        console.error(error);
        core.error(JSON.stringify(error));
    }
}))();
