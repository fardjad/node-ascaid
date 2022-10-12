import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import stripJsonComments from "strip-json-comments";

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

export const readConfig = async (
  configFilePath = "./ascaid.config.json",
  attributeOverrideKvs = []
) => {
  if (!(await fileExists(configFilePath))) {
    return { extensions: [], asciidoctorOptions: {} };
  }

  const config = JSON.parse(
    stripJsonComments(
      await fs.promises.readFile(configFilePath, { encoding: "utf8" })
    )
  );

  if (!config.asciidoctorOptions) {
    config.asciidoctorOptions = {};
  }
  if (!config.asciidoctorOptions.attributes) {
    config.asciidoctorOptions.attributes = {};
  }
  config.asciidoctorOptions.attributes = {
    ...config.asciidoctorOptions.attributes,
    ...Object.fromEntries(attributeOverrideKvs.map((kv) => kv.split("=", 2))),
  };

  // TODO: validate the schema

  return config;
};
