import OpenApiGenerator from "../service/OpenApiGenerator";
import Constants from "../utils/Constants";
import * as github from "@actions/github";
import * as core from "@actions/core";
import { FileService } from "../service/FileService";
import { execute } from "../utils/execute";

export default class KotlinPublisher {
    static async publish(artifact: string, group: string, version: string) {
        await OpenApiGenerator.generate({
            input: Constants.SCHEMA_FILE_PATH,
            output: Constants.DEPLOYMENT_KOTLIN,
            generator: Constants.DEPLOYMENT_KOTLIN,
            additionalProperties: [
                `artifactId=${artifact}`,
                `artifactVersion=${version}`,
                `groupId=${group}`,
            ],
            gitUserId: github.context.repo.owner,
            gitRepoId: github.context.repo.repo,
        });
        core.notice(`${Constants.DEPLOYMENT_KOTLIN} Creation complete`);

        var gradle = await FileService.read(Constants.DEPLOYMENT_KOTLIN + "/build.gradle");

        gradle = gradle.replace(
            "publishing {",
            `publishing {
                repositories {
                    maven {
                        name = "GitHubPackages"
                        url = "https://maven.pkg.github.com/${github.context.repo.owner}/${github.context.repo.repo}"
                        credentials {
                        username = "${github.context.repo.owner}"
                        password = "${Constants.DEPLOY_TOKEN}"
                        }
                    }
                }`
        )

        await FileService.write(Constants.DEPLOYMENT_KOTLIN + "/build.gradle", gradle);
        core.notice(`${Constants.DEPLOYMENT_KOTLIN} Gradle file updated`);

        await KotlinPublisher.publishCommand(Constants.DEPLOYMENT_KOTLIN);
        core.notice(`${Constants.DEPLOYMENT_KOTLIN} Published`);        

    }

    private static async publishCommand(output: string) {
        await execute(`cd ${output}; gradle publish`);
    }

}