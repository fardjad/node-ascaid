import { pandocConvert } from "./pandoc-convert.js";

const MD_TITLE_REGEX = /^#+\s+(.*)/;

const defaultMarkdownOptions = {
  pandocReadFormat: "gfm",
  pandocArguments: ["--wrap=none"],
};

export const getTitleFromMarkdown = (contents) => {
  const firstHeading = contents
    .split(/\n\r?/)
    .find((line) => MD_TITLE_REGEX.test(line.trim()));

  if (firstHeading != undefined) {
    return firstHeading.match(MD_TITLE_REGEX)[1].trim();
  }

  return;
};

export const mdConvert = async (contents, markdownOptions = {}) => {
  const mergedMarkdownOptions = {
    ...defaultMarkdownOptions,
    ...markdownOptions,
  };

  return pandocConvert(
    contents,
    mergedMarkdownOptions.pandocReadFormat,
    "html",
    mergedMarkdownOptions.pandocArguments
  );
};
