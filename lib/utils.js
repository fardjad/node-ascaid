import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const fileExists = async (path) =>
  !!(await fs.promises.stat(path).catch(() => false));

export const invokeInDir = async (dir, function_) => {
  const cwd = process.cwd();
  process.chdir(dir);

  return Promise.resolve(function_(cwd, dir)).finally(() => {
    process.chdir(cwd);
  });
};

export const readVersion = async () => {
  const packageJSONPath = path.join(__dirname, "../package.json");
  const packageJSON = JSON.parse(await fs.promises.readFile(packageJSONPath));

  return packageJSON.version;
};

export const readConfig = async (configFilePath = "./ascaid.config.json") => {
  if (!(await fileExists(configFilePath))) {
    return { extensions: [] };
  }

  const config = JSON.parse(await fs.promises.readFile(configFilePath));

  // TODO: validate the schema

  return config;
};
