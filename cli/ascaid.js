import { program } from 'commander';

import { readVersionSync } from '../lib/utils.js';

const version = readVersionSync();

program
  .version(version)
  .description('A collection of AsciiDoc tools')
  .command('serve [directory]', 'start an AsciiDoc server')
  .command('adoc-to-gfm <srcDir> <outDir>', 'AsciiDoc -> GitHub flavored markdown')
  .command('gfm-to-confluence <dir>', 'Publish a GitHub flavored markdown directory to Confluence');

program.parse(process.argv);
