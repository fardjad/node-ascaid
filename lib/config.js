import fs from "node:fs";
import stripJsonComments from "strip-json-comments";
import Ajv from "ajv";

import { fileExists } from "./utils.js";

const ajv = new Ajv();
const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extensions: {
      type: "array",
      items: {
        type: "string",
      },
    },
    asciidoctorOptions: {
      type: "object",
      properties: {
        attributes: {
          type: "object",
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    },
  },
};
const validate = ajv.compile(schema);

export const findConfigFile = async (
  pathOverride,
  fileExistsFn = fileExists
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

  const config = JSON.parse(
    stripJsonComments(
      await fs.promises.readFile(finalConfigFilePath, { encoding: "utf8" })
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

  const valid = validate(config);
  if (!valid) {
    const error = new Error("Invalid config file");
    error.errors = validate.errors;
    throw error;
  }

  return config;
};