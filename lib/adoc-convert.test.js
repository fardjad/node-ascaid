import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

import { adocConvert } from './adoc-convert.js';
import { invokeInDir } from './utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, '__fixtures__');

test('adocConvert', async () => {
  const input = await fs.promises.readFile(path.join(fixturesPath, './doc.adoc'), { encoding: 'utf-8' });
  const html = await invokeInDir(fixturesPath, async () => {
    return adocConvert(input);
  });

  expect(html).toContain('<!DOCTYPE html>');
  expect(html).toContain('kroki');
  expect(html).toContain('Widdershins');
});
