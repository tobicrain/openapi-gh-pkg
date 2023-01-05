import * as fs from "fs";
import * as yaml from "js-yaml";

export class FileService {
    static async read(path: string): Promise<string> {
        const file = await fs.promises.readFile(path, "utf8");
        return file;
    }

    static async readYML(path: string): Promise<any> {
        const file = await this.read(path);
        return yaml.load(file);
    }

    static async write(path: string, content: string): Promise<void> {
        return await fs.promises.writeFile(path, content, "utf8");
    }

}