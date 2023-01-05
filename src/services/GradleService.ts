import { execute } from "../util/syncToAsync";

export class GradleService {
    static applyPluginsAndPublishing(gradleFile: string, owner: string, githubToken: string, repoName: string) {
        const publishingConfig = `
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
      
        return gradleFile
          .replace("plugins {", "plugins {\n    id 'kotlin'\n    id 'maven-publish'")
          .replace("publishing {", publishingConfig);
    }

    static async publish(outputPath: string): Promise<string> {
        return await execute(`cd ${outputPath}; ./gradlew publish`);
    }
        
}