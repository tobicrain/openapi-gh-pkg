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
const fs = __importStar(require("fs"));
const constants_1 = __importDefault(require("../util/constants"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const syncToAsync_1 = require("../util/syncToAsync");
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const ownerName = github.context.repo.owner;
const githubToken = core.getInput(constants_1.default.GITHUB_TOKEN);
const npmToken = core.getInput(constants_1.default.NPM_TOKEN);
const jarArtifactId = core.getInput(constants_1.default.JAR_ARTIFACT_ID);
const jarArtifactGroupId = core.getInput(constants_1.default.JAR_GROUP_ID);
const openApiPath = core.getInput(constants_1.default.OPEN_API_FILE_PATH);
const outputPath = core.getInput(constants_1.default.OUTPUT_PATH);
const repoName = github.context.repo.repo;
const dottedArtifact = repoName.replace(/-/g, ".");
const firstArtifact = dottedArtifact.split(".")[0];
const artifactId = jarArtifactId != "" ? jarArtifactId : repoName.replace(/-/g, "_");
const groupID = jarArtifactGroupId != "" ? jarArtifactGroupId : `com.${ownerName}`;
class DeployService {
    static getYML() {
        return __awaiter(this, void 0, void 0, function* () {
            const ymlFile = yield fs.promises.readFile(openApiPath, "utf8");
            const yml = js_yaml_1.default.load(ymlFile);
            return yml;
        });
    }
    static handleAngular() {
        return __awaiter(this, void 0, void 0, function* () {
            const yml = yield this.getYML();
            const version = yml.info.version;
            core.notice("Repository name: " + repoName);
            core.notice("OpenAPI file path: " + openApiPath);
            core.notice("OpenAPI version: " + version);
            yield (0, syncToAsync_1.execute)(`npx @openapitools/openapi-generator-cli generate -i ${openApiPath} -g typescript-angular -o ${outputPath} --git-user-id "${ownerName}" --git-repo-id "${repoName}" --additional-properties=npmName=@${ownerName}/${repoName},npmRepository=https://npm.pkg.github.com/`);
            core.notice(`Generated Angular code`);
            yield (0, syncToAsync_1.execute)(`cd ${outputPath}; npm install`);
            core.notice(`npm Install`);
            yield (0, syncToAsync_1.execute)(`cd ${outputPath}; npm run build`);
            core.notice(`npm run build`);
            yield fs.promises.writeFile(`${outputPath}/dist/.npmrc`, `//npm.pkg.github.com/:_authToken=${npmToken}`, "utf8");
            core.notice(`Created .npmrc`);
            yield (0, syncToAsync_1.execute)(`cd ${outputPath}/dist; npm publish`);
            core.notice(`npm publish`);
        });
    }
    static handleKotlinClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const ymlFile = yield fs.promises.readFile(openApiPath, "utf8");
            const yml = js_yaml_1.default.load(ymlFile);
            const version = yml.info.version;
            core.notice("Repository name: " + repoName);
            core.notice("OpenAPI file path: " + openApiPath);
            core.notice("OpenAPI version: " + version);
            yield (0, syncToAsync_1.execute)(`npx @openapitools/openapi-generator-cli generate -i ${openApiPath} -g kotlin -o ${outputPath} --git-user-id ${ownerName} --git-repo-id ${repoName} --additional-properties=artifactId=${artifactId},artifactVersion=${version},groupId=${groupID}`);
            core.notice(`Generated Kotlin Client code`);
            const gradleFile = yield fs.promises.readFile(`${outputPath}/build.gradle`, "utf8");
            const newGradleFile = gradleFile.replace("apply plugin: 'kotlin'", constants_1.default.GRADLE_PLUGINS(ownerName, repoName, githubToken));
            core.notice(`Modified build.gradle`);
            yield fs.promises.writeFile(`${outputPath}/build.gradle`, newGradleFile, "utf8");
            core.notice(`Updated build.gradle`);
            yield (0, syncToAsync_1.execute)(`cd ${outputPath}; gradle publish`);
            core.notice(`Deployed to GitHub Packages`);
        });
    }
    static handleSpring() {
        return __awaiter(this, void 0, void 0, function* () {
            const ymlFile = yield fs.promises.readFile(openApiPath, "utf8");
            const yml = js_yaml_1.default.load(ymlFile);
            const version = yml.info.version;
            core.notice("Repository name: " + repoName);
            core.notice("OpenAPI file path: " + openApiPath);
            core.notice("OpenAPI version: " + version);
            core.notice("Generating Spring code");
            core.notice(`artifactId=${artifactId},`);
            core.notice(`artifactVersion=${version},`);
            core.notice(`groupId=${groupID},`);
            core.notice(`npx @openapitools/openapi-generator-cli generate -i ${openApiPath} -g spring -o ${outputPath} --git-user-id ${ownerName} --git-repo-id ${repoName} --additional-properties=artifactId=${artifactId},artifactVersion=${version},groupId=${groupID}`);
            yield (0, syncToAsync_1.execute)(`npx @openapitools/openapi-generator-cli generate -i ${openApiPath} -g spring -o ${outputPath} --git-user-id ${ownerName} --git-repo-id ${repoName} --additional-properties=artifactId=${artifactId},artifactVersion=${version},groupId=${groupID}`);
            core.notice(`Generated Spring code`);
            const pomFile = yield fs.promises.readFile(`${outputPath}/pom.xml`, "utf8");
            const newPomFile = pomFile
                .replace("</project>", constants_1.default.POM_DISTRIBUTION(ownerName, repoName))
                .replace("</properties>", constants_1.default.POM_PROPERTIES);
            core.notice(`Modified project and properties in pom.xml`);
            yield fs.promises.writeFile(`${outputPath}/pom.xml`, newPomFile, "utf8");
            core.notice(`Updated pom.xml`);
            yield (0, syncToAsync_1.execute)(`
      mkdir ~/.m2;
      touch ~/.m2/settings.xml;
      echo '${constants_1.default.SETTINGS_XML(ownerName, githubToken)}' > ~/.m2/settings.xml;
    `);
            core.notice(`Created settings.xml`);
            yield (0, syncToAsync_1.execute)(`cd ${outputPath}; mvn deploy --settings ~/.m2/settings.xml -DskipTests`);
            core.notice(`Deployed to GitHub Packages`);
        });
    }
}
exports.default = DeployService;
