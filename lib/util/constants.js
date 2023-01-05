"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Constants {
}
exports.default = Constants;
Constants.PLATFORM = "PLATFORM";
Constants.ARTIFACT_ID = "ARTIFACT_ID";
Constants.GROUP_ID = "GROUP_ID";
Constants.SCHEMA_FILE_PATH = "SCHEMA_FILE_PATH";
Constants.DEPLOY_TOKEN = "DEPLOY_TOKEN";
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
