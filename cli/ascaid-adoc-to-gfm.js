import { program, Argument, Option } from 'commander';
import { promisify } from 'util';
import globcb from 'glob';
import path from 'path';
import fs from 'fs';

import { adocConvert } from '../lib/adoc-convert.js';
import { pandocConvert } from '../lib/pandoc-convert.js';
import { invokeInDir, readVersionSync } from '../lib/utils.js';

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

    const basename = path.basename(fileName);
    const fileNameWithoutExtension = basename.substr(0, basename.length - path.extname(basename).length);
    await fs.promises.writeFile(path.join(writeDir, `${fileNameWithoutExtension}.md`), gfm, { encoding: 'utf-8' });
  }
};

program
  .version(version)
  .addArgument(new Argument('<srcDir>', 'source directory'))
  .addArgument(new Argument('<outDir>', 'output directory'))
  .addOption(new Option('--ignore [ignore...]', 'glob patterns to ignore').default(['**/_*']))
  .description('Recursively convert AsciiDoc files in a directory to GitHub flavored markdown')
  .action(async (srcDir, outDir, { ignore }) => {
    await adocToGfm(srcDir, outDir, ignore);
  });

program.parse(process.argv);
