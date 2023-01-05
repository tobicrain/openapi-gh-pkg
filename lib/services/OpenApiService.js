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
exports.OpenApiService = void 0;
const syncToAsync_1 = require("../util/syncToAsync");
class OpenApiService {
    static generate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            // build the command string
            const command = `npx @openapitools/openapi-generator-cli generate -i ${options.input} -g ${options.generator} -o ${options.output} --git-user-id ${options.gitUserId} --git-repo-id ${options.gitRepoId} --additional-properties=${options.additionalProperties.join(",")}`;
            // execute the command string
            return yield (0, syncToAsync_1.execute)(command);
        });
    }
}
exports.OpenApiService = OpenApiService;
