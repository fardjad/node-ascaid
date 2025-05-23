import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { expect } from "expect";

import { invokeInDir, readVersion } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, "./__fixtures__");

await test("invokeInDir", async (t) => {
  await t.test("invoke a function in the specific directory", async () => {
    const cwd = process.cwd();
    const result = await invokeInDir(
      fixturesPath,
      (previousWorkingDirectory, currentWorkingDirectory) => {
        expect(previousWorkingDirectory).toBe(cwd);
        expect(currentWorkingDirectory).toBe(process.cwd());

        return process.cwd();
      },
    );
    expect(process.cwd()).toBe(cwd);
    expect(result).toBe(fixturesPath);
  });

  await t.test("await promises before returning a result", async () => {
    let count = 0;

    const result = await invokeInDir(fixturesPath, async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });

      count += 1;

      return count;
    });

    expect(count).toBe(1);
    expect(result).toBe(count);
  });
});

await test("readVersion", async (t) => {
  await t.test("read the package version", async () => {
    const version = await readVersion();
    expect(typeof version).toBe("string");
  });
});
