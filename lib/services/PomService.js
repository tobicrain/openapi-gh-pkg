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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PomService = void 0;
const constants_1 = __importDefault(require("../util/constants"));
const syncToAsync_1 = require("../util/syncToAsync");
class PomService {
    static applyDistributionAndProperties(pomFile, owner, repoName) {
        const newPomFile = pomFile
            .replace("</project>", constants_1.default.POM_DISTRIBUTION(owner, repoName))
            .replace("</properties>", constants_1.default.POM_PROPERTIES);
        return newPomFile;
    }
    static writeSettingsXmlFile(owner, githubToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const settingsXml = constants_1.default.SETTINGS_XML(owner, githubToken);
            return yield (0, syncToAsync_1.execute)(`
            mkdir ~/.m2;
            touch ~/.m2/settings.xml;
            echo '${settingsXml}' > ~/.m2/settings.xml;
        `);
        });
    }
    static publish(outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, syncToAsync_1.execute)(`cd ${outputPath}; mvn deploy --settings ~/.m2/settings.xml -DskipTests`);
        });
    }
}
exports.PomService = PomService;
