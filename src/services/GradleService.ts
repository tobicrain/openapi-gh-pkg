import Constants from "../util/constants";
import { execute } from "../util/syncToAsync";

export class GradleService {
    static applyPluginsAndPublishing(gradleFile: string, owner: string, githubToken: string, repoName: string) {
        const newGradleFile = gradleFile.replace(
            "apply plugin: 'kotlin'",
            Constants.GRADLE_PLUGINS(owner, repoName, githubToken)
        );

        return newGradleFile;
    }

    static async publish(outputPath: string): Promise<string> {
        return await execute(`cd ${outputPath}; gradle publish`);
    }
        
}