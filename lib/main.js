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
const core = __importStar(require("@actions/core"));
const AngularPublisher_1 = __importDefault(require("./publisher/AngularPublisher"));
const JavaPublisher_1 = __importDefault(require("./publisher/JavaPublisher"));
const KotlinPublisher_1 = __importDefault(require("./publisher/KotlinPublisher"));
const SpringPublisher_1 = __importDefault(require("./publisher/SpringPublisher"));
const FileService_1 = require("./service/FileService");
const Constants_1 = __importDefault(require("./utils/Constants"));
const execute_1 = require("./utils/execute");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        core.notice(Constants_1.default.SCHEMA_FILE_PATH);
        const schemaFile = yield FileService_1.FileService.readYML(Constants_1.default.SCHEMA_FILE_PATH);
        const deploymentNames = Object.keys(schemaFile["x-deploy"]);
        const deploymentValues = Object.values(schemaFile["x-deploy"]);
        core.notice(`Found ${deploymentNames.length} deployments`);
        core.notice(`Deployments: ${deploymentNames.join(", ")}`);
        core.notice(`Installing OpenAPI Generator CLI`);
        yield (0, execute_1.execute)('npm install @openapitools/openapi-generator-cli -g');
        // await execute('openapi-generator-cli');
        deploymentNames.forEach((deploymentName) => __awaiter(this, void 0, void 0, function* () {
            switch (deploymentName) {
                case "kotlin":
                    core.notice(`Found Kotlin deployment`);
                    const kotlinDeployment = schemaFile["x-deploy"].kotlin;
                    core.notice(`Kotlin package artifact: ${kotlinDeployment.artifact}`);
                    core.notice(`Kotlin package group: ${kotlinDeployment.group}`);
                    yield KotlinPublisher_1.default.publish(kotlinDeployment.artifact, kotlinDeployment.group, schemaFile.info.version);
                    break;
                case "java":
                    core.notice(`Found Java deployment`);
                    const javaDeployment = schemaFile["x-deploy"].java;
                    core.notice(`Java package artifact: ${javaDeployment.artifact}`);
                    core.notice(`Java package group: ${javaDeployment.group}`);
                    yield JavaPublisher_1.default.publish(javaDeployment.artifact, javaDeployment.group, schemaFile.info.version);
                    break;
                case "spring":
                    core.notice(`Found Spring deployment`);
                    const springDeployment = schemaFile["x-deploy"].spring;
                    core.notice(`Spring package artifact: ${springDeployment.artifact}`);
                    core.notice(`Spring package group: ${springDeployment.group}`);
                    yield SpringPublisher_1.default.publish(springDeployment.artifact, springDeployment.group, schemaFile.info.version);
                    break;
                case "typescript-angular":
                    core.notice(`Found TypeScript Angular deployment`);
                    const typescriptAngularDeployment = schemaFile["x-deploy"]["typescript-angular"];
                    core.notice(`TypeScript Angular package name: ${typescriptAngularDeployment.name}`);
                    yield AngularPublisher_1.default.publish(typescriptAngularDeployment.name);
                    break;
                default:
                    core.error(`Unknown deployment: ${deploymentName}`);
                    break;
            }
        }));
    });
}
main()
    .then(() => {
    core.notice("Deployment complete");
})
    .catch(error => {
    core.setFailed(error.message);
});
