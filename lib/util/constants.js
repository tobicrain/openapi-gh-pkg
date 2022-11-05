"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Constants {
}
exports.default = Constants;
Constants.PLATFORMS = "PLATFORMS";
Constants.GITHUB_USERNAME = "GITHUB_USERNAME";
Constants.GITHUB_TOKEN = "GITHUB_TOKEN";
Constants.OPEN_API_FILE_PATH = "OPEN_API_FILE_PATH";
Constants.OUTPUT_PATH = "OUTPUT_PATH";
Constants.NPM_TOKEN = "NPM_TOKEN";
Constants.GRADLE_PLUGINS = () => `
plugins {
    id 'org.jetbrains.kotlin.jvm' version '1.7.20'
    id 'maven-publish'
}

repositories {`;
Constants.GRADLE_PUBLISHING = (owner, repoName, githubToken) => `
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
}
wrapper {`;
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
