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
const constants_1 = __importDefault(require("../util/constants"));
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const FileService_1 = require("./FileService");
const OpenApiService_1 = require("./OpenApiService");
const NpmService_1 = require("./NpmService");
const GradleService_1 = require("./GradleService");
const PomService_1 = require("./PomService");
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
    static handleAngular() {
        return __awaiter(this, void 0, void 0, function* () {
            const yml = yield FileService_1.FileService.readYML(openApiPath);
            yield OpenApiService_1.OpenApiService.generate({
                input: openApiPath,
                output: outputPath,
                generator: "typescript-angular",
                additionalProperties: [
                    `npmName=@${ownerName}/${repoName}`,
                    `npmRepository=https://npm.pkg.github.com/`,
                ],
                gitUserId: ownerName,
                gitRepoId: repoName,
            });
            core.notice(`Generated Angular code`);
            NpmService_1.NpmService.install(outputPath);
            core.notice(`Installed npm packages`);
            NpmService_1.NpmService.build(outputPath);
            core.notice(`Built npm package`);
            NpmService_1.NpmService.publish(outputPath, npmToken);
            core.notice(`Published npm package`);
        });
    }
    static handleKotlinClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const yml = yield FileService_1.FileService.readYML(openApiPath);
            const version = yml.info.version;
            yield OpenApiService_1.OpenApiService.generate({
                input: openApiPath,
                output: outputPath,
                generator: "kotlin",
                additionalProperties: [
                    `artifactId=${artifactId}`,
                    `artifactVersion=${version}`,
                    `groupId=${groupID}`,
                ],
                gitUserId: ownerName,
                gitRepoId: repoName,
            });
            core.notice(`Generated Kotlin Client code`);
            const gradleFile = yield FileService_1.FileService.read(`${outputPath}/build.gradle`);
            const newGradleFile = GradleService_1.GradleService.applyPluginsAndPublishing(gradleFile, ownerName, githubToken, repoName);
            yield FileService_1.FileService.write(`${outputPath}/build.gradle`, newGradleFile);
            core.notice(`Updated build.gradle`);
            yield GradleService_1.GradleService.publish(outputPath);
            core.notice(`Deployed to GitHub Packages`);
        });
    }
    static handleSpring() {
        return __awaiter(this, void 0, void 0, function* () {
            const yml = yield FileService_1.FileService.readYML(openApiPath);
            const version = yml.info.version;
            yield OpenApiService_1.OpenApiService.generate({
                input: openApiPath,
                output: outputPath,
                generator: "spring",
                additionalProperties: [
                    `artifactId=${artifactId}`,
                    `artifactVersion=${version}`,
                    `groupId=${groupID}`,
                ],
                gitUserId: ownerName,
                gitRepoId: repoName,
            });
            core.notice(`Generated Spring code`);
            const pomFile = yield FileService_1.FileService.read(`${outputPath}/pom.xml`);
            const newPomFile = PomService_1.PomService.applyDistributionAndProperties(pomFile, ownerName, repoName);
            yield FileService_1.FileService.write(`${outputPath}/pom.xml`, newPomFile);
            core.notice(`Updated pom.xml`);
            yield PomService_1.PomService.writeSettingsXmlFile(ownerName, githubToken);
            core.notice(`Created settings.xml`);
            yield PomService_1.PomService.publish(outputPath);
            core.notice(`Deployed to GitHub Packages`);
        });
    }
}
exports.default = DeployService;
