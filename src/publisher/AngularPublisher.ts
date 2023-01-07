import OpenApiGenerator from "../service/OpenApiGenerator";
import Constants from "../utils/Constants";
import * as github from "@actions/github";
import * as core from "@actions/core";
import { FileService } from "../service/FileService";
import { execute } from "../utils/execute";

export default class AngularTypescriptPublisher {
    static async publish(name: string) {
        await OpenApiGenerator.generate({
            input: Constants.SCHEMA_FILE_PATH,
            output: Constants.DEPLOYMENT_TYPESCRIPT_ANGULAR,
            generator: Constants.DEPLOYMENT_TYPESCRIPT_ANGULAR,
            additionalProperties: [
              `npmName=@${github.context.repo.owner}/${name}`,
              `npmRepository=https://npm.pkg.github.com/`,
            ],
            gitUserId: github.context.repo.owner,
            gitRepoId: github.context.repo.repo,
        });
        core.notice(`${Constants.DEPLOYMENT_TYPESCRIPT_ANGULAR} Creation complete`);

        AngularTypescriptPublisher.installCommand();
        core.notice(`Installed npm packages`);
    
        AngularTypescriptPublisher.buildCommand();
        core.notice(`Built npm package`);
    
        AngularTypescriptPublisher.publishCommand();
        core.notice(`Published npm package`);

    }

    static async publishCommand(): Promise<string> {
        await FileService.write(`${Constants.DEPLOYMENT_TYPESCRIPT_ANGULAR}/dist/.npmrc`, `//npm.pkg.github.com/:_authToken=${Constants.DEPLOY_TOKEN}`);
        return await execute(`cd ${Constants.DEPLOYMENT_TYPESCRIPT_ANGULAR}/dist; npm publish`);
    }

    static async installCommand(): Promise<string> {
        return await execute(`cd ${Constants.DEPLOYMENT_TYPESCRIPT_ANGULAR}; npm install`);
    }

    static async buildCommand(): Promise<string> {
        return await execute(`cd ${Constants.DEPLOYMENT_TYPESCRIPT_ANGULAR}; npm run build`);
    }

}