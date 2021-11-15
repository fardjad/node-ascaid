import { program, Argument } from 'commander';

import { startAsciidocServer } from '../lib/adoc-server.js';
import { readVersionSync } from '../lib/utils.js';

const version = readVersionSync();

program
  .version(version)
  .addArgument(new Argument('[rootDir]', 'server root directory').default('.', 'current directory'))
  .description('Start an AsciiDoc server')
  .action((rootDir) => {
    startAsciidocServer(rootDir);
  });

program.parse(process.argv);
