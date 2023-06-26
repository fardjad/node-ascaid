import { URL } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import browserSync from "browser-sync";

import {
  asciidocExtensions,
  fileExists,
  invokeInDir,
  markdownExtensions,
  normalizeSupportedExtnames,
} from "./utils.js";
import { adocConvert } from "./adoc-convert.js";
import { getTitleFromMarkdown, mdConvert } from "./md-convert.js";

export const createAsciidocMiddleware = (rootDir, config = {}) => {
  const absoluteRootDir = path.resolve(rootDir);

  return async (request, res, next) => {
    try {
      const url = new URL(request.url, "http://localhost");

      // https://nodejs.org/en/knowledge/file-system/security/introduction/
      if (url.pathname.includes("\0")) {
        res.statusCode = 400;

        return res.end(http.STATUS_CODES[res.statusCode]);
      }

      const extname = normalizeSupportedExtnames(path.extname(url.pathname));

      if ([".md", ".adoc"].includes(extname)) {
        const filePath = path.join(absoluteRootDir, url.pathname);
        const exists = await fileExists(filePath);
        if (!exists || !filePath.startsWith(absoluteRootDir)) {
          res.statusCode = 404;

          return res.end(http.STATUS_CODES[res.statusCode]);
        }

        const contents = await fs.readFile(filePath, { encoding: "utf8" });
        let html = await invokeInDir(path.dirname(filePath), async () => {
          switch (extname) {
            case ".adoc": {
              return adocConvert(contents, config.asciidoctorOptions);
            }
            case ".md": {
              const title =
                (await getTitleFromMarkdown(contents)) ?? "Untitled";
              return mdConvert(contents, config.markdownOptions).then(
                (body) =>
                  `<!DOCTYPE html><html><head><title>${title}</title></head><body>${body}</body></html>`
              );
            }
            default: {
              throw new Error(`Unsupported extension: ${extname}`);
            }
          }
        });
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        html = html.replace(
          /<\/head>/,
          `<script async src="//${request.headers.host}/browser-sync/browser-sync-client.js"></script></head>`
        );

        res.statusCode = 200;

        return res.end(html);
      }
    } catch (error) {
      return next(error);
    }

    next();
  };
};

export const startAsciidocServer = async (rootDir = ".", config = {}) => {
  const bs = browserSync.create();

  bs.init({
    files: `**/*.{${[...asciidocExtensions, ...markdownExtensions].join(",")}`,
    server: rootDir,
    injectFileTypes: [...asciidocExtensions, ...markdownExtensions],
    middleware: [createAsciidocMiddleware(rootDir, config)],
    directory: true,
    open: false,
    ui: false,
    logSnippet: true,
    watch: true,
    injectChanges: false,
    reloadOnRestart: true,
  });

  return bs;
};
