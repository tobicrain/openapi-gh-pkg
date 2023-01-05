export default class Constants {
  static readonly PLATFORM = "PLATFORM";
  static readonly ARTIFACT_ID = "ARTIFACT_ID";
  static readonly GROUP_ID = "GROUP_ID";
  static readonly SCHEMA_FILE_PATH = "SCHEMA_FILE_PATH";
  static readonly DEPLOY_TOKEN = "DEPLOY_TOKEN";

  static readonly GRADLE_PLUGINS = (
    owner: string,
    repoName: string,
    githubToken: string) => `
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
