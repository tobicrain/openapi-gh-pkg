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
const githubUsername = core.getInput(constants_1.default.GITHUB_USERNAME);
const githubToken = core.getInput(constants_1.default.GITHUB_TOKEN);
const openApiPath = core.getInput(constants_1.default.OPEN_API_FILE_PATH);
const outputPath = core.getInput(constants_1.default.OUTPUT_PATH);
const repoName = github.context.repo.repo;
const ownerName = github.context.repo.owner;
const dottedArtifact = repoName.replace(/-/g, ".");
const firstArtifact = dottedArtifact.split(".")[0];
class DeployService {
    static handleAngular() {
        return __awaiter(this, void 0, void 0, function* () {
            const ymlFile = yield fs.promises.readFile(openApiPath, "utf8");
            const yml = js_yaml_1.default.load(ymlFile);
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
            yield fs.promises.writeFile(`${outputPath}/dist/.npmrc`, `
//npm.pkg.github.com/:_authToken=${githubToken}
@${ownerName}:registry=https://npm.pkg.github.com
always-auth=true
`, "utf8");
            core.notice(`Created .npmrc`);
            yield (0, syncToAsync_1.execute)(`cd ${outputPath}/dist; npm publish`);
            core.notice(`npm publish`);
        });
    }
    static handleKotlinSpring() {
        return __awaiter(this, void 0, void 0, function* () {
            const ymlFile = yield fs.promises.readFile(openApiPath, "utf8");
            const yml = js_yaml_1.default.load(ymlFile);
            const version = yml.info.version;
            core.notice("Repository name: " + repoName);
            core.notice("OpenAPI file path: " + openApiPath);
            core.notice("OpenAPI version: " + version);
            yield (0, syncToAsync_1.execute)(`npx @openapitools/openapi-generator-cli generate -i ${openApiPath} -g kotlin-spring -o ${outputPath} --git-user-id "${ownerName}" --git-repo-id "${repoName}" --additional-properties=delegatePattern=true,apiPackage=de.${dottedArtifact},artifactId=${repoName},basePackage=de.${firstArtifact},artifactVersion=${version},packageName=de.${firstArtifact},title=${repoName}`);
            core.notice(`Generated Kotlin Spring code`);
            const pomFile = yield fs.promises.readFile(`${outputPath}/pom.xml`, "utf8");
            const newPomFile = pomFile
                .replace("</project>", constants_1.default.POM_DISTRIBUTION(ownerName, repoName))
                .replace("</properties>", constants_1.default.POM_PROPERTIES);
            core.notice(`Modified project and properties in pom.xml`);
            yield fs.promises.writeFile(`${outputPath}/pom.xml`, newPomFile, "utf8");
            core.notice(`Updated pom.xml`);
            yield fs.promises.writeFile(__dirname + "/settings.xml", `<settings><servers><server><id>github</id><username>${githubUsername}</username><password>${githubToken}</password></server></servers></settings>`, "utf8");
            core.notice(`Created settings.xml`);
            yield (0, syncToAsync_1.execute)(`cd ${outputPath}; mvn deploy --settings ${__dirname}/settings.xml -DskipTests`);
            core.notice(`Deployed to GitHub Packages`);
        });
    }
}
exports.default = DeployService;
