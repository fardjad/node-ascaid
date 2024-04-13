import fs from "node:fs";
import Ajv from "ajv";
import jsoncParser from "jsonc-parser";

import { fileExists } from "./utils.js";

const ajv = new Ajv();
const schema = JSON.parse(
  fs.readFileSync(new URL("../ascaid.config.schema.json", import.meta.url)),
);
const validate = ajv.compile(schema);

export const findConfigFile = async (
  pathOverride,
  fileExistsFn = fileExists,
) => {
  if (!pathOverride) {
    const configFilePaths = ["./ascaid.config.json", "./ascaid.config.jsonc"];

    for (const path of configFilePaths) {
      if (await fileExistsFn(path)) {
        return path;
      }
    }

    return;
  }

  if (!(await fileExistsFn(pathOverride))) {
    throw new Error(`Config file not found: ${pathOverride}`);
  }

  return pathOverride;
};

export const readConfig = async (configFilePath, attributeOverrideKvs = []) => {
  const finalConfigFilePath = await findConfigFile(configFilePath);
  if (!finalConfigFilePath) {
    return { extensions: [], asciidoctorOptions: {} };
  }

  const parseErrors = [];

  const config = jsoncParser.parse(
    await fs.promises.readFile(finalConfigFilePath, { encoding: "utf8" }),
    parseErrors,
    { allowTrailingComma: true, allowEmptyContent: true },
  );

  if (parseErrors.length > 0) {
    throw new Error(
      `Error parsing config file: ${finalConfigFilePath}. Make sure it's a valid JSON or JSONC file.`,
    );
  }

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

  const valid = validate(config);
  if (!valid) {
    const error = new Error("Invalid config file");
    error.errors = validate.errors;
    throw error;
  }

  return config;
};
