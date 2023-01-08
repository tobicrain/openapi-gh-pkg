import * as core from "@actions/core";
import { JARDeployment, NPMDeployment, OpenApiYML } from "./models/OpenApiYML";
import AngularTypescriptPublisher from "./publisher/AngularPublisher";
import JavaPublisher from "./publisher/JavaPublisher";
import KotlinPublisher from "./publisher/KotlinPublisher";
import SpringPublisher from "./publisher/SpringPublisher";
import { FileService } from "./service/FileService";
import Constants from "./utils/Constants";
import { execute } from "./utils/execute";


async function main() {

    core.notice(Constants.SCHEMA_FILE_PATH)

    const schemaFile = await FileService.readYML<OpenApiYML>(Constants.SCHEMA_FILE_PATH);
    const deploymentNames = Object.keys(schemaFile["x-deploy"])
    const deploymentValues = Object.values(schemaFile["x-deploy"])

    core.notice(`Found ${deploymentNames.length} deployments`);
    core.notice(`Deployments: ${deploymentNames.join(", ")}`);

    core.notice(`Installing OpenAPI Generator CLI`);
    await execute('npm install @openapitools/openapi-generator-cli -g');
    await execute(`openapi-generator-cli validate -i ${Constants.SCHEMA_FILE_PATH}`);


    deploymentNames.forEach(async deploymentName => {
        switch (deploymentName) {
            case "kotlin":
                core.notice(`Found Kotlin deployment`);

                const kotlinDeployment = schemaFile["x-deploy"].kotlin as JARDeployment

                core.notice(`Kotlin package artifact: ${kotlinDeployment.artifact}`);
                core.notice(`Kotlin package group: ${kotlinDeployment.group}`);
                await KotlinPublisher.publish(kotlinDeployment.artifact, kotlinDeployment.group, schemaFile.info.version);
                break;
            case "java":
                core.notice(`Found Java deployment`);

                const javaDeployment = schemaFile["x-deploy"].java as JARDeployment

                core.notice(`Java package artifact: ${javaDeployment.artifact}`);
                core.notice(`Java package group: ${javaDeployment.group}`);
                await JavaPublisher.publish(javaDeployment.artifact, javaDeployment.group, schemaFile.info.version);
                break;
            case "spring":
                core.notice(`Found Spring deployment`);
                const springDeployment = schemaFile["x-deploy"].spring as JARDeployment
                core.notice(`Spring package artifact: ${springDeployment.artifact}`);
                core.notice(`Spring package group: ${springDeployment.group}`);
                await SpringPublisher.publish(springDeployment.artifact, springDeployment.group, schemaFile.info.version);
                break;
            case "typescript-angular":
                core.notice(`Found TypeScript Angular deployment`);
                const typescriptAngularDeployment = schemaFile["x-deploy"]["typescript-angular"] as NPMDeployment
                core.notice(`TypeScript Angular package name: ${typescriptAngularDeployment.name}`);
                await AngularTypescriptPublisher.publish(typescriptAngularDeployment.name);
                break;
            default:
                core.error(`Unknown deployment: ${deploymentName}`);
                break;
        }
    });
    
}

main()
.then(() => {
    core.notice("Deployment complete");
})
.catch(error => {
    core.setFailed(error.message);
})