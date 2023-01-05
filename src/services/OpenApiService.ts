import { execute } from "../util/syncToAsync";

export class OpenApiService {
    
    static async generate(options: {
        input: string;
        output: string;
        generator: string;
        additionalProperties: string[];
        gitUserId: string;
        gitRepoId: string;
    }): Promise<string> {
        // build the command string
        const command = `npx @openapitools/openapi-generator-cli generate -i ${options.input} -g ${options.generator} -o ${options.output} --git-user-id ${options.gitUserId} --git-repo-id ${options.gitRepoId} --additional-properties=${options.additionalProperties.join(",")}`;
        // execute the command string
        return await execute(command);
    }
    
}