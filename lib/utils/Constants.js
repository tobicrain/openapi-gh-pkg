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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
class Constants {
}
exports.default = Constants;
Constants.DEPLOY_TOKEN_STRING = "DEPLOY_TOKEN";
Constants.SCHEMA_FILE_PATH_STRING = "SCHEMA_FILE_PATH";
Constants.SCHEMA_FILE_PATH = core.getInput(Constants.SCHEMA_FILE_PATH_STRING);
Constants.DEPLOY_TOKEN = core.getInput(Constants.DEPLOY_TOKEN_STRING);
Constants.DEPLOYMENT_KOTLIN = "kotlin";
Constants.DEPLOYMENT_JAVA = "java";
Constants.DEPLOYMENT_SPRING = "spring";
Constants.DEPLOYMENT_TYPESCRIPT_ANGULAR = "typescript-angular";
Constants.DEPLOYMENT_TYPESCRIPT_AXIOS = "typescript-axios";
Constants.GRADLE_PLUGINS = (owner, repoName, githubToken) => `
apply plugin: 'kotlin'
apply plugin: 'maven-publish'

publishing {
    repositories {
        maven {
            name = "GitHubPackages"
            url = "https://maven.pkg.github.com/${owner}/${repoName}"
            credentials {
            username = "${owner}"
            password = "${githubToken}"
            }
        }
    }
    publications {
        gpr(MavenPublication) {
            from(components.java)
        }
    } 
}`;
Constants.SETTINGS_XML = (githubUsername, githubToken) => `
  <settings>
    <servers>
      <server>
        <id>github</id>
        <username>${githubUsername}</username>
        <password>${githubToken}</password>
      </server>
    </servers>
  </settings>
  `;
Constants.POM_DISTRIBUTION = (owner, repoName) => `
        <distributionManagement>
            <repository>
                <id>github</id>
                <name>GitHub ${owner} Apache Maven Packages</name>
                <url>https://maven.pkg.github.com/${owner}/${repoName}</url>
            </repository>
        </distributionManagement>
    </project>
    `;
Constants.POM_PROPERTIES = `
        <spring-boot.repackage.skip>true</spring-boot.repackage.skip>
    </properties>`;
