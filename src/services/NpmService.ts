import * as fs from "fs";
import { execute } from "../util/syncToAsync";


export class NpmService {
    static async publish(path: string, token: string): Promise<string> {
        // create the .npmrc file
        await fs.promises.writeFile(`${path}/.npmrc`, `//npm.pkg.github.com/:_authToken=${token}`, "utf8");
        // publish the package
        return await execute(`cd ${path}; npm publish`);
    }

    static async install(path: string): Promise<string> {
        return await execute(`cd ${path}; npm install`);
    }

    static async build(path: string): Promise<string> {
        return await execute(`cd ${path}; npm run build`);
    }
}
