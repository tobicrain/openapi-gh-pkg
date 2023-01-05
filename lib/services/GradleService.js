"use strict";
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
exports.GradleService = void 0;
const syncToAsync_1 = require("../util/syncToAsync");
class GradleService {
    static applyPluginsAndPublishing(gradleFile, owner, githubToken, repoName) {
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
    static publish(outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, syncToAsync_1.execute)(`cd ${outputPath}; gradle publish`);
        });
    }
}
exports.GradleService = GradleService;
