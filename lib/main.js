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
const fs = __importStar(require("fs"));
const constants_1 = __importDefault(require("./util/constants"));
const { exec } = require('child_process');
const yaml = require('js-yaml');
const distributionManagement = (owner, repoName) => `
    <distributionManagement>
        <repository>
            <id>github</id>
            <name>GitHub ${owner} Apache Maven Packages</name>
            <url>https://maven.pkg.github.com/${owner}/${repoName}</url>
        </repository>
    </distributionManagement>
</project>
`;
function execute(command) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise(function (resolve, reject) {
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(stdout);
            });
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
        // Set all Input Parameters
        const githubUsername = core.getInput(constants_1.default.GITHUB_USERNAME);
        const githubToken = core.getInput(constants_1.default.GITHUB_TOKEN);
        const openApiPath = core.getInput(constants_1.default.OPEN_API_FILE_PATH);
        const repoName = github.context.repo.repo;
        const ownerName = github.context.repo.owner;
        const dottedArtifactId = repoName.replace(/-/g, '.');
        const firstArtifactId = dottedArtifactId.split('.')[0];
        const ymlFile = yield fs.promises.readFile(openApiPath, 'utf8');
        const yml = yaml.load(ymlFile);
        const version = yml.info.version;
        core.notice("Repository name: " + repoName);
        core.notice("OpenAPI file path:" + openApiPath);
        core.notice("OpenAPI version:" + version);
        yield execute(`npx @openapitools/openapi-generator-cli generate -i ${openApiPath} -g kotlin-spring -o kotlin --git-user-id "${ownerName}" --git-repo-id "${repoName}" --additional-properties=delegatePattern=true,apiPackage=de.${dottedArtifactId},artifactId=${repoName},basePackage=de.${firstArtifactId},artifactVersion=${version},packageName=de.${firstArtifactId},title=${repoName}`);
        core.notice(`Generated Kotlin Spring code`);
        const pomFile = yield fs.promises.readFile('kotlin/pom.xml', 'utf8');
        const newPomFile = pomFile
            .replace("</project>", distributionManagement(ownerName, repoName))
            .replace("</properties>", properties);
        console.log(newPomFile);
        core.notice(`Updated pom.xml`);
        yield fs.promises.writeFile('kotlin/pom.xml', newPomFile, 'utf8');
        core.notice(`Updated pom.xml`);
        fs.writeFile(__dirname + '/settings.xml', `<settings><servers><server><id>github</id><username>${githubUsername}</username><password>${githubToken}</password></server></servers></settings>`, 'utf8', function (err) {
            if (err)
                return console.log(err);
            console.log('settings.xml updated');
            readDir();
            exec(`cd ${__dirname}/kotlin; mvn deploy --settings ${__dirname}/settings.xml -DskipTests`, (error3, stdout3, stderr3) => {
                console.log(`stdout3: ${stdout3}`);
                console.log(`stderr3: ${stderr3}`);
                if (error3) {
                    console.log(`error3: ${error3.message}`);
                    return;
                }
            });
        });
    }
    catch (error) {
        console.error(error);
        core.error(JSON.stringify(error));
    }
}))();
