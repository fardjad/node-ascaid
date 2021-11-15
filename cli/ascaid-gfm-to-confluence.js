import { program, Argument, Option } from 'commander';
import { promisify } from 'util';
import globcb from 'glob';
import path from 'path';
import fs from 'fs';
import assert from 'assert';

import { adocConvert } from '../lib/adoc-convert.js';
import { pandocConvert } from '../lib/pandoc-convert.js';
import { invokeInDir, readVersionSync } from '../lib/utils.js';
import { ConfluenceClient } from '../lib/confluence-client.js';

const MD_TITLE_REGEX = /^#+\s+(.*)/;

const glob = promisify(globcb);
const version = readVersionSync();

export const adocToGfm = async (srcDir, outDir, ignore) => {
  const matches = await glob('**/*.{asciidoc,adoc,asc}', {
    nocase: true,
    cwd: srcDir,
    ignore,
  });

  for (const fileName of matches) {
    const dirname = path.dirname(fileName);

    const writeDir = path.join(outDir, dirname);
    await fs.promises.mkdir(writeDir, { recursive: true });

    const adoc = await fs.promises.readFile(path.join(srcDir, fileName), { encoding: 'utf-8' });

    const readDir = path.join(srcDir, dirname);
    const html = await invokeInDir(readDir, () => {
      return adocConvert(adoc);
    });
    const gfm = await pandocConvert(html, 'html', 'gfm');

    const fileNameWithoutExtension = fileName.substr(0, fileName.length - path.extname(fileName).length);
    await fs.promises.writeFile(path.join(writeDir, `${fileNameWithoutExtension}.md`), gfm, { encoding: 'utf-8' });
  }
};

const isNotNullOrEmptyString = (str) => {
  return str != null && typeof str === 'string' && str.trim() !== '';
};

const createPageTree = async (title, filePath) => {
  const files = (await fs.promises.readdir(filePath)).map((file) => ({
    name: file,
    extension: path.extname(file),
    path: `${filePath}/${file}`,
    isDirectory: fs.lstatSync(`${filePath}/${file}`).isDirectory(),
  }));

  const children = [];

  for (const file of files) {
    if (!file.isDirectory) {
      if (file.extension.toLowerCase() !== '.md') continue;
      const contents = fs.readFileSync(file.path, { encoding: 'utf-8' });

      let title = file.name.substr(0, file.name.length - file.extension.length);
      const firstLine = contents.split(/\n\r?/).find((line) => MD_TITLE_REGEX.test(line.trim()));
      if (firstLine != null) {
        title = firstLine.match(MD_TITLE_REGEX)[1].trim();
      }
      const body = await pandocConvert(contents, 'gfm', 'html');
      children.push({
        title,
        body,
        children: [],
      });
    } else {
      children.push(await createPageTree(file.name, file.path));
    }
  }

  const body = '<p></p>';

  return { title, body, children };
};

program
  .version(version)
  .addArgument(new Argument('<dir>', 'dir to publish to Confluence'))
  .addOption(
    new Option('--api-base-url [apiBaseUrl]', 'Confluence API base URL').default(
      process.env.CONFLUENCE_API_BASE_URL,
      'CONFLUENCE_API_BASE_URL environment variable',
    ),
  )
  .addOption(
    new Option('--api-username [apiUsername]', 'Confluence API username').default(
      process.env.CONFLUENCE_API_USERNAME,
      'CONFLUENCE_API_USERNAME environment variable',
    ),
  )
  .addOption(
    new Option('--api-password [apiPassword]', 'Confluence API password').default(
      process.env.CONFLUENCE_API_PASSWORD,
      'CONFLUENCE_API_USERNAME environment variable',
    ),
  )
  .addOption(
    new Option('--space-key [spaceKey]', 'Confluence space key').default(
      process.env.CONFLUENCE_SPACE_KEY,
      'CONFLUENCE_SPACE_KEY environment variable',
    ),
  )
  .addOption(
    new Option('--root-page-id [rootPageId]', 'Confluence root page ID').default(
      process.env.CONFLUENCE_ROOT_PAGE_ID,
      'CONFLUENCE_ROOT_PAGE_ID environment variable',
    ),
  )
  .addOption(
    new Option('--root-page-title [rootPageTitle]', 'Confluence root page title').default(
      process.env.CONFLUENCE_ROOT_PAGE_TITLE,
      'CONFLUENCE_ROOT_PAGE_TITLE environment variable',
    ),
  )
  .description('Recursively publish a GitHub flavored markdown directory to Confluence')
  .action(async (dir, { apiBaseUrl, apiUsername, apiPassword, spaceKey, rootPageId, rootPageTitle }) => {
    try {
      assert.ok(isNotNullOrEmptyString(apiBaseUrl), "missing required option 'apiBaseURL'");
      assert.ok(isNotNullOrEmptyString(apiUsername), "missing required option 'apiUsername'");
      assert.ok(isNotNullOrEmptyString(apiPassword), "missing required option 'apiPassword'");
      assert.ok(isNotNullOrEmptyString(spaceKey), "missing required option 'spaceKey'");
      assert.ok(isNotNullOrEmptyString(rootPageId), "missing required option 'rootPageID'");
      assert.ok(isNotNullOrEmptyString(rootPageTitle), "missing required option 'rootPageTitle'");

      const confluence = new ConfluenceClient({ apiUsername, apiPassword, apiBaseUrl, spaceKey, rootPageId });
      const page = await createPageTree(rootPageTitle, dir);
      await confluence.createConfluencePage(page);
    } catch (ex) {
      console.error(`error: ${ex.message}`);
    }
  });

program.parse(process.argv);
