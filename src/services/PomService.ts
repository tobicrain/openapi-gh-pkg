import Constants from "../util/constants";
import { execute } from "../util/syncToAsync";

export class PomService {
    static applyDistributionAndProperties(pomFile: string, owner: string, repoName: string) {
        const newPomFile = pomFile
            .replace("</project>", Constants.POM_DISTRIBUTION(owner, repoName))
            .replace("</properties>", Constants.POM_PROPERTIES);
        return newPomFile;
    }

    static async writeSettingsXmlFile(owner: string, githubToken: string): Promise<string> {
        const settingsXml = Constants.SETTINGS_XML(owner, githubToken);
       
        return await execute(`
            mkdir ~/.m2;
            touch ~/.m2/settings.xml;
            echo '${settingsXml}' > ~/.m2/settings.xml;
        `)
    }

    static async publish(outputPath: string): Promise<string> {
        return await execute(`cd ${outputPath}; mvn deploy --settings ~/.m2/settings.xml -DskipTests`);
    }
}