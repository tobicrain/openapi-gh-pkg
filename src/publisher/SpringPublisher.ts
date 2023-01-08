import OpenApiGenerator from "../service/OpenApiGenerator";
import Constants from "../utils/Constants";
import * as github from "@actions/github";
import * as core from "@actions/core";
import { FileService } from "../service/FileService";
import { execute } from "../utils/execute";

export default class SpringPublisher {
    static async publish(artifact: string, group: string, version: string) {
        await OpenApiGenerator.generate({
            input: Constants.SCHEMA_FILE_PATH,
            output: Constants.DEPLOYMENT_SPRING,
            generator: Constants.DEPLOYMENT_SPRING,
            additionalProperties: [
                `artifactId=${artifact}`,
                `artifactVersion=${version}`,
                `groupId=${group}`,
                `apiPackage=${group}.api`,
                `modelPackage=${group}.model`,
                `invokerPackage=${group}.api`,
            ],
            gitUserId: github.context.repo.owner,
            gitRepoId: github.context.repo.repo,
        });
        core.notice(`${Constants.DEPLOYMENT_SPRING} Creation complete`);

        var pom = await FileService.read(Constants.DEPLOYMENT_SPRING + "/pom.xml");

        pom = pom
            .replace("</project>", Constants.POM_DISTRIBUTION(github.context.repo.owner, github.context.repo.repo))
            .replace("</properties>", Constants.POM_PROPERTIES);

        await FileService.write(Constants.DEPLOYMENT_SPRING + "/pom.xml", pom);
        core.notice(`${Constants.DEPLOYMENT_SPRING} POM file updated`);

        await SpringPublisher.createSettingsXML()
        core.notice(`${Constants.DEPLOYMENT_SPRING} Settings file created`);

        await SpringPublisher.publishCommand();
        core.notice(`${Constants.DEPLOYMENT_SPRING} Published`);

    }

    private static async createSettingsXML() {
        await FileService.write(Constants.DEPLOYMENT_SPRING + "/settings.xml", Constants.SETTINGS_XML(github.context.repo.owner, Constants.DEPLOY_TOKEN))
    }

    private static async publishCommand() {
        await execute(`cd ${Constants.DEPLOYMENT_SPRING}; mvn deploy --settings settings.xml -DskipTests`);
    }

}