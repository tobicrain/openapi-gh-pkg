import * as fs from "fs";
import Constants from "../util/constants";
import yaml from "js-yaml";
import { execute } from "../util/syncToAsync";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { FileService } from "./FileService";
import { OpenApiService } from "./OpenApiService";
import { NpmService } from "./NpmService";
import { GradleService } from "./GradleService";
import { PomService } from "./PomService";

const ownerName = github.context.repo.owner as string;
const githubToken = core.getInput(Constants.GITHUB_TOKEN);
const npmToken = core.getInput(Constants.NPM_TOKEN);
const jarArtifactId = core.getInput(Constants.JAR_ARTIFACT_ID);
const jarArtifactGroupId = core.getInput(Constants.JAR_GROUP_ID);

const openApiPath = core.getInput(Constants.OPEN_API_FILE_PATH);
const outputPath = core.getInput(Constants.OUTPUT_PATH);

const repoName = github.context.repo.repo as string;

const dottedArtifact = repoName.replace(/-/g, ".");
const firstArtifact = dottedArtifact.split(".")[0];

const artifactId = jarArtifactId != "" ? jarArtifactId: repoName.replace(/-/g, "_");
const groupID = jarArtifactGroupId != "" ? jarArtifactGroupId : `com.${ownerName}`

export default class DeployService {

  static async handleAngular() {
    
    const yml: any = await FileService.readYML(openApiPath)

    await OpenApiService.generate({
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

    NpmService.install(outputPath);
    core.notice(`Installed npm packages`);

    NpmService.build(outputPath);
    core.notice(`Built npm package`);

    NpmService.publish(outputPath, npmToken);
    core.notice(`Published npm package`);
  }

  static async handleKotlinClient() {
    
    const yml: any = await FileService.readYML(openApiPath)

    const version: string = yml.info.version;
    
    await OpenApiService.generate({
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

    const gradleFile = await FileService.read(`${outputPath}/build.gradle`);

    const newGradleFile = GradleService.applyPluginsAndPublishing(
      gradleFile,
      ownerName,
      githubToken,
      repoName
    );

    await FileService.write(`${outputPath}/build.gradle`, newGradleFile);
    core.notice(`Updated build.gradle`);

    await GradleService.publish(outputPath);
    core.notice(`Deployed to GitHub Packages`);
  }

  static async handleSpring() {
    
    const yml: any = await FileService.readYML(openApiPath)

    const version: string = yml.info.version;
    
    await OpenApiService.generate({
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

    const pomFile = await FileService.read(`${outputPath}/pom.xml`);

    const newPomFile = PomService.applyDistributionAndProperties(
      pomFile,
      ownerName,
      repoName
    );

    await FileService.write(`${outputPath}/pom.xml`, newPomFile);

    core.notice(`Updated pom.xml`);

    await PomService.writeSettingsXmlFile(ownerName, githubToken);

    core.notice(`Created settings.xml`);

    await PomService.publish(outputPath);

    core.notice(`Deployed to GitHub Packages`);
  }
}
