import * as core from "@actions/core";
import * as github from "@actions/github";
import { FileService } from "../service/FileService";
import OpenApiGenerator from "../service/OpenApiGenerator";
import Constants from "../utils/Constants";
import { execute } from "../utils/execute";

export default class TypescriptAxiosPublisher {
  static async publish(name: string) {
    await OpenApiGenerator.generate({
      input: Constants.SCHEMA_FILE_PATH,
      output: Constants.DEPLOYMENT_TYPESCRIPT_AXIOS,
      generator: Constants.DEPLOYMENT_TYPESCRIPT_AXIOS,
      additionalProperties: [
        `npmName=@${github.context.repo.owner}/${name}`,
        `npmRepository=https://npm.pkg.github.com/`,
      ],
      gitUserId: github.context.repo.owner,
      gitRepoId: github.context.repo.repo,
    });
    core.notice(`${Constants.DEPLOYMENT_TYPESCRIPT_AXIOS} Creation complete`);

    await TypescriptAxiosPublisher.installCommand();
    core.notice(`Installed npm packages`);

    await TypescriptAxiosPublisher.buildCommand();
    core.notice(`Built npm package`);

    await TypescriptAxiosPublisher.publishCommand();
    core.notice(`Published npm package`);
  }

  static async publishCommand(): Promise<string> {
    await FileService.write(
      `${Constants.DEPLOYMENT_TYPESCRIPT_AXIOS}/dist/.npmrc`,
      `//npm.pkg.github.com/:_authToken=${Constants.DEPLOY_TOKEN}`
    );
    return await execute(
      `cd ${Constants.DEPLOYMENT_TYPESCRIPT_AXIOS}/dist; npm publish`
    );
  }

  static async installCommand(): Promise<string> {
    return await execute(
      `cd ${Constants.DEPLOYMENT_TYPESCRIPT_AXIOS}; npm install`
    );
  }

  static async buildCommand(): Promise<string> {
    return await execute(
      `cd ${Constants.DEPLOYMENT_TYPESCRIPT_AXIOS}; npm run build`
    );
  }
}
