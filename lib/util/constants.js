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
