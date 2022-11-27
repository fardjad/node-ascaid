import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const markdownExtensions = [
  "md",
  "markdown",
  "mdown",
  "mkdn",
  "mkd",
  "mdwn",
  "mkdown",
  "ron",
];

export const asciidocExtensions = ["adoc", "asciidoc", "acs"];

/**
 * Normalize supported extensions
 *
 * @param {string} extname
 * @return {".md" | ".adoc" | undefined} ".md" for markdown extensions, ".adoc" for asciidoc extensions. Otherwise, undefined
 */
export const normalizeSupportedExtnames = (extname) => {
  if (!extname.startsWith(".")) {
    return;
  }

  const extnameWithoutLeadingDot = extname.slice(1).toLowerCase();

  if (markdownExtensions.includes(extnameWithoutLeadingDot)) {
    return ".md";
  }

  if (asciidocExtensions.includes(extnameWithoutLeadingDot)) {
    return ".adoc";
  }

  return;
};

export const isNotNullOrEmptyString = (maybeString) => {
  return (
    maybeString != undefined &&
    typeof maybeString === "string" &&
    maybeString.trim() !== ""
  );
};

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
