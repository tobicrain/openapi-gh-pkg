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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const openApiPath = core.getInput("OPEN_API_FILE_PATH");
        const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN");
        const { data } = yield github.getOctokit(GITHUB_TOKEN).rest.repos.getContent({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            path: openApiPath
        });
        const contentString = data === null || data === void 0 ? void 0 : data.content;
        if (contentString) {
            const openApiContent = Buffer.from(contentString, "base64").toString();
            core.notice(openApiContent);
        }
        else {
            core.setFailed("No content found");
        }
        core.notice("Calling our action");
    }
    catch (error) {
        core.error(JSON.stringify(error));
    }
}))();
// npx @openapitools/openapi-generator-cli generate -i api.yaml -g kotlin-spring -o kotlin --git-user-id "tandamo" --git-repo-id "scanq-client-api" --additional-properties=delegatePattern=true,apiPackage=de.scanq.client-api,artifactId=scanq-client-api,basePackage=de.scanq,artifactVersion=0.1.15,packageName=de.scanq,title=scanq-client-api
