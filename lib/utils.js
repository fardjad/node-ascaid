import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const fileExists = async (path) => !!(await fs.promises.stat(path).catch((e) => false));

export const invokeInDir = async (dir, fn) => {
  const cwd = process.cwd();
  process.chdir(dir);

  return Promise.resolve(fn(cwd, dir)).finally(() => {
    process.chdir(cwd);
  });
};

export const readVersionSync = () => {
  const packageJSONPath = path.join(__dirname, '../package.json');
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, { encoding: 'utf-8' }));

  return packageJSON.version;
};
