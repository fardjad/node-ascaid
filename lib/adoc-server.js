import { URL } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import browserSync from "browser-sync";

import { fileExists, invokeInDir } from "./utils.js";
import { adocConvert } from "./adoc-convert.js";

export const createAsciidocMiddleware = (rootDir, adoctorOptions = {}) => {
  const absoluteRootDir = path.resolve(rootDir);

  return async (request, res, next) => {
    try {
      const url = new URL(request.url, "http://localhost");

      // https://nodejs.org/en/knowledge/file-system/security/introduction/
      if (url.pathname.includes("\0")) {
        res.statusCode = 400;

        return res.end(http.STATUS_CODES[res.statusCode]);
      }

      if (/\.(adoc|asciidoc|acs)$/i.test(url.pathname)) {
        const adocPath = path.join(absoluteRootDir, url.pathname);
        const exists = await fileExists(adocPath);
        if (!exists || !adocPath.startsWith(absoluteRootDir)) {
          res.statusCode = 404;

          return res.end(http.STATUS_CODES[res.statusCode]);
        }

        const adoc = await fs.readFile(adocPath, { encoding: "utf8" });
        let html = await invokeInDir(path.dirname(adocPath), () => {
          return adocConvert(adoc, adoctorOptions);
        });
        res.setHeader("Content-Type", "text/html");
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

export const startAsciidocServer = async (
  rootDir = ".",
  adoctorOptions = {}
) => {
  const bs = browserSync.create();

  bs.init({
    files: "**/*.{adoc,asciidoc,acs}",
    server: rootDir,
    injectFileTypes: ["adoc", "asciidoc", "acs"],
    middleware: [createAsciidocMiddleware(rootDir, adoctorOptions)],
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
