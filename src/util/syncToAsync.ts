import { exec } from "child_process";

export async function execute (command: string): Promise<string> {
  return await new Promise(function (resolve, reject) {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        reject(err);
      }
      resolve(stdout);
    });
  });
}