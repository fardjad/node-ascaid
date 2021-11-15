import { URL } from 'url';
import fs from 'fs/promises';
import path from 'path';
import http from 'http';
import browserSync from 'browser-sync';

import { fileExists, invokeInDir } from './utils.js';
import { adocConvert } from './adoc-convert.js';

export const createAsciidocMiddleware = (rootDir) => {
  const absoluteRootDir = path.resolve(rootDir);

  return async (req, res, next) => {
    try {
      const url = new URL(req.url, 'http://localhost');

      // https://nodejs.org/en/knowledge/file-system/security/introduction/
      if (url.pathname.includes('\0')) {
        res.statusCode = 400;

        return res.end(http.STATUS_CODES[res.statusCode]);
      }

      if (url.pathname.match(/\.(adoc|asciidoc|acs)$/i)) {
        const adocPath = path.join(absoluteRootDir, url.pathname);
        const exists = await fileExists(adocPath);
        if (!exists || !adocPath.startsWith(absoluteRootDir)) {
          res.statusCode = 404;

          return res.end(http.STATUS_CODES[res.statusCode]);
        }

        const adoc = await fs.readFile(adocPath, { encoding: 'utf-8' });
        let html = await invokeInDir(path.dirname(adocPath), () => {
          return adocConvert(adoc);
        });
        res.setHeader('Content-Type', 'text/html');
        html = html.replace(
          /<\/head>/,
          '<script async src="//' + req.headers.host + '/browser-sync/browser-sync-client.js"></script></head>',
        );

        res.statusCode = 200;

        return res.end(html);
      }
    } catch (ex) {
      return next(ex);
    }

    next();
  };
};

export const startAsciidocServer = async (rootDir = '.') => {
  const bs = browserSync.create();

  bs.init({
    files: '**/*.{adoc,asciidoc,acs}',
    server: rootDir,
    injectFileTypes: ['adoc', 'asciidoc', 'acs'],
    middleware: [createAsciidocMiddleware(rootDir)],
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
