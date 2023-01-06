import * as fs from "fs";
import { parse, stringify } from 'yaml'
// or
import YAML from 'yaml'
export class FileService {
    static async read(path: string): Promise<string> {
        const file = await fs.promises.readFile(path, "utf8");
        return file;
    }

    static async readYML<T>(path: string): Promise<T> {
        const file = await this.read(path);
        return YAML.parse(file) as T
    }

    static async write(path: string, content: string): Promise<void> {
        return await fs.promises.writeFile(path, content, "utf8");
    }

}