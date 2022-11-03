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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const GithubService_1 = __importDefault(require("./services/GithubService"));
const constants_1 = __importDefault(require("./util/constants"));
const { exec } = require('child_process');
function readDir() {
    exec(`ls`, (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err);
        }
        else {
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout2: ${stdout}`);
            console.log(`stderr2: ${stderr}`);
        }
    });
    // list files in current directory
    exec(`cd ${__dirname}; ls`, (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err);
        }
        else {
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        core.notice("Hello World!");
        const openApiPath = core.getInput(constants_1.default.OPEN_API_FILE_PATH);
        core.notice(`OpenAPI file path: ${openApiPath}`);
        const fileContent = yield GithubService_1.default.content(openApiPath);
        const openApiFile = path.join(__dirname, 'openapi.yaml');
        fs.writeFileSync(openApiFile, fileContent);
        core.notice(`OpenAPI file saved to: ${openApiFile}`);
        readDir();
        exec(`npx @openapitools/openapi-generator-cli generate -i openapi.yaml -g kotlin-spring -o kotlin --git-user-id "tandamo" --git-repo-id "scanq-client-api" --additional-properties=delegatePattern=true,apiPackage=de.scanq.client-api,artifactId=scanq-client-api,basePackage=de.scanq,artifactVersion=0.1.15,packageName=de.scanq,title=scanq-client-api`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            readDir();
            console.log(`stdout: ${stdout}`);
        });
    }
    catch (error) {
        core.error(JSON.stringify(error));
    }
}))();
