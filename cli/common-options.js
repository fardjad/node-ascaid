import { Option } from "commander";

export const attributeOption = new Option(
  "-a, --attribute [key=value...]",
  "set a document attribute. The value given will override values from the config file. Passing the key without =value will unset the attribute",
).default([]);

export const configOption = new Option(
  "-c, --config <path>",
  "config file path",
);
