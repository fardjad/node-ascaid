import { Argument, Option, program } from "commander";
import path from "node:path";
import fs from "node:fs";
import assert from "node:assert";

import { pandocConvert } from "../index.js";
import { readVersion } from "../index.js";
import { ConfluenceClient } from "../index.js";

const MD_TITLE_REGEX = /^#+\s+(.*)/;

const isNotNullOrEmptyString = (string_) => {
  return (
    string_ != undefined && typeof string_ === "string" && string_.trim() !== ""
  );
};

const createPageTree = async (title, filePath) => {
  const dirContents = await fs.promises.readdir(filePath);
  const files = dirContents.map((file) => ({
    name: file,
    extension: path.extname(file),
    path: `${filePath}/${file}`,
    isDirectory: fs.lstatSync(`${filePath}/${file}`).isDirectory(),
  }));

  const children = [];

  for (const file of files) {
    if (!file.isDirectory) {
      if (file.extension.toLowerCase() !== ".md") continue;
      const contents = fs.readFileSync(file.path, { encoding: "utf8" });

      let title = file.name.slice(
        0,
        Math.max(0, file.name.length - file.extension.length)
      );
      const firstLine = contents
        .split(/\n\r?/)
        .find((line) => MD_TITLE_REGEX.test(line.trim()));
      if (firstLine != undefined) {
        title = firstLine.match(MD_TITLE_REGEX)[1].trim();
      }
      const body = await pandocConvert(contents, "gfm", "html", [
        "--wrap=none",
      ]);
      children.push({
        title,
        body,
        children: [],
      });
    } else {
      children.push(await createPageTree(file.name, file.path));
    }
  }

  const body = "<p></p>";

  return { title, body, children };
};

const version = await readVersion();

program
  .version(version)
  .addArgument(new Argument("<dir>", "dir to publish to Confluence"))
  .addOption(
    new Option(
      "--api-base-url [apiBaseUrl]",
      "Confluence API base URL"
    ).default(
      process.env.CONFLUENCE_API_BASE_URL,
      "CONFLUENCE_API_BASE_URL environment variable"
    )
  )
  .addOption(
    new Option(
      "--api-username [apiUsername]",
      "Confluence API username"
    ).default(
      process.env.CONFLUENCE_API_USERNAME,
      "CONFLUENCE_API_USERNAME environment variable"
    )
  )
  .addOption(
    new Option(
      "--api-password [apiPassword]",
      "Confluence API password"
    ).default(
      process.env.CONFLUENCE_API_PASSWORD,
      "CONFLUENCE_API_USERNAME environment variable"
    )
  )
  .addOption(
    new Option("--space-key [spaceKey]", "Confluence space key").default(
      process.env.CONFLUENCE_SPACE_KEY,
      "CONFLUENCE_SPACE_KEY environment variable"
    )
  )
  .addOption(
    new Option(
      "--root-page-id [rootPageId]",
      "Confluence root page ID"
    ).default(
      process.env.CONFLUENCE_ROOT_PAGE_ID,
      "CONFLUENCE_ROOT_PAGE_ID environment variable"
    )
  )
  .addOption(
    new Option(
      "--root-page-title [rootPageTitle]",
      "Confluence root page title"
    ).default(
      process.env.CONFLUENCE_ROOT_PAGE_TITLE,
      "CONFLUENCE_ROOT_PAGE_TITLE environment variable"
    )
  )
  .description(
    "Recursively publish a GitHub flavored markdown directory to Confluence"
  )
  .action(
    async (
      dir,
      {
        apiBaseUrl,
        apiUsername,
        apiPassword,
        spaceKey,
        rootPageId,
        rootPageTitle,
      }
    ) => {
      try {
        assert.ok(
          isNotNullOrEmptyString(apiBaseUrl),
          "missing required option 'apiBaseURL'"
        );
        assert.ok(
          isNotNullOrEmptyString(apiUsername),
          "missing required option 'apiUsername'"
        );
        assert.ok(
          isNotNullOrEmptyString(apiPassword),
          "missing required option 'apiPassword'"
        );
        assert.ok(
          isNotNullOrEmptyString(spaceKey),
          "missing required option 'spaceKey'"
        );
        assert.ok(
          isNotNullOrEmptyString(rootPageId),
          "missing required option 'rootPageID'"
        );
        assert.ok(
          isNotNullOrEmptyString(rootPageTitle),
          "missing required option 'rootPageTitle'"
        );

        const confluence = new ConfluenceClient({
          apiUsername,
          apiPassword,
          apiBaseUrl,
          spaceKey,
          rootPageId,
        });
        const page = await createPageTree(rootPageTitle, dir);
        await confluence.createConfluencePage(page);
      } catch (error) {
        console.error(
          `error: ${error.response?.body?.message ?? error.message}`
        );
      }
    }
  );

await program.parseAsync(process.argv);
