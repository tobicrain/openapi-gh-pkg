import * as core from "@actions/core";
import { OpenApiYML } from "./models/OpenApiYML";
import { FileService } from "./service/FileService";
import Constants from "./utils/Constants";

const schemaFilePath = core.getInput(Constants.SCHEMA_FILE_PATH);

async function main() {

    const schemaFile = await FileService.readYML<OpenApiYML>(schemaFilePath);
    const deploymentNames = Object.keys(schemaFile["x-deploy"])
    const deploymentValues = Object.keys(schemaFile["x-deploy"])

    core.notice(`Found ${deploymentNames.length} deployments`);
    core.notice(`Deployments: ${deploymentNames.join(", ")}`);

    deploymentNames.forEach(deploymentName => {
        const deployment = deploymentValues[deploymentName];
        switch (deploymentName) {
            case "kotlin":
                core.notice(`Found Kotlin deployment`);
                break;
            case "spring":
                core.notice(`Found Spring deployment`);
                break;
            case "typescript-angular":
                core.notice(`Found TypeScript Angular deployment`);
                break;
            default:
                core.error(`Unknown deployment: ${deploymentName}`);
                break;
        }
    });
    
}

main();