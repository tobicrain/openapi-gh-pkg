import * as core from "@actions/core";
import { JARDeployment, NPMDeployment, OpenApiYML } from "./models/OpenApiYML";
import AngularTypescriptPublisher from "./publisher/AngularPublisher";
import KotlinPublisher from "./publisher/KotlinPublisher";
import SpringPublisher from "./publisher/SpringPublisher";
import { FileService } from "./service/FileService";
import Constants from "./utils/Constants";

const schemaFilePath = core.getInput(Constants.SCHEMA_FILE_PATH);

async function main() {

    core.notice(schemaFilePath)
    core.notice(core.getInput("SCHEMA_FILE_PATH"))
    const schemaFile = await FileService.readYML<OpenApiYML>(schemaFilePath);
    const deploymentNames = Object.keys(schemaFile["x-deploy"])
    const deploymentValues = Object.values(schemaFile["x-deploy"])

    core.notice(`Found ${deploymentNames.length} deployments`);
    core.notice(`Deployments: ${deploymentNames.join(", ")}`);

    deploymentNames.forEach(deploymentName => {
        const deployment = deploymentValues[deploymentName];
        switch (deploymentName) {
            case "kotlin":
                core.notice(`Found Kotlin deployment`);
                const kotlinDeployment = deployment as JARDeployment
                core.notice(`Kotlin package artifact: ${kotlinDeployment.artifact}`);
                core.notice(`Kotlin package group: ${kotlinDeployment.group}`);
                KotlinPublisher.publish(kotlinDeployment.artifact, kotlinDeployment.group, schemaFile.info.version);
                break;
            case "spring":
                core.notice(`Found Spring deployment`);
                const springDeployment = deployment as JARDeployment;
                core.notice(`Spring package artifact: ${springDeployment.artifact}`);
                core.notice(`Spring package group: ${springDeployment.group}`);
                SpringPublisher.publish(springDeployment.artifact, springDeployment.group, schemaFile.info.version);
                break;
            case "typescript-angular":
                core.notice(`Found TypeScript Angular deployment`);
                const typescriptAngularDeployment = deployment as NPMDeployment;
                core.notice(`TypeScript Angular package name: ${typescriptAngularDeployment.name}`);
                AngularTypescriptPublisher.publish(typescriptAngularDeployment.name, schemaFile.info.version);
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