import * as core from "@actions/core";

export default class Constants {
    private static readonly DEPLOY_TOKEN_STRING = "DEPLOY_TOKEN";
    private static readonly SCHEMA_FILE_PATH_STRING = "SCHEMA_FILE_PATH";

    static readonly SCHEMA_FILE_PATH = core.getInput(Constants.SCHEMA_FILE_PATH_STRING);
    static readonly DEPLOY_TOKEN = core.getInput(Constants.DEPLOY_TOKEN_STRING);

    static readonly DEPLOYMENT_KOTLIN = "kotlin";
    static readonly DEPLOYMENT_JAVA = "java";
    static readonly DEPLOYMENT_SPRING = "spring";
    static readonly DEPLOYMENT_TYPESCRIPT_ANGULAR = "typescript-angular";

    static readonly GRADLE_PLUGINS = (
        plugin: string,
        owner: string,
        repoName: string,
        githubToken: string
    ) => `
apply plugin: '${plugin}'
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
static readonly SETTINGS_XML = (
    githubUsername: string,
    githubToken: string
  ) => `
  <settings>
    <servers>
      <server>
        <id>github</id>
        <username>${githubUsername}</username>
        <password>${githubToken}</password>
      </server>
    </servers>
  </settings>
  `
  static readonly POM_DISTRIBUTION = (owner: string, repoName: string) => `
        <distributionManagement>
            <repository>
                <id>github</id>
                <name>GitHub ${owner} Apache Maven Packages</name>
                <url>https://maven.pkg.github.com/${owner}/${repoName}</url>
            </repository>
        </distributionManagement>
    </project>
    `;
  static readonly POM_PROPERTIES = `
        <spring-boot.repackage.skip>true</spring-boot.repackage.skip>
    </properties>`;
}