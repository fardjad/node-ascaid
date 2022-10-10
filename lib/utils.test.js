import { fileURLToPath } from "node:url";
import path from "node:path";

import { invokeInDir, readConfig, readVersion } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, "./__fixtures__");

describe("invokeInDir", () => {
  it("should invoke a function in the specific directory", async () => {
    const cwd = process.cwd();
    const result = await invokeInDir(
      fixturesPath,
      (previousWorkingDirectory, currentWorkingDirectory) => {
        expect(previousWorkingDirectory).toBe(cwd);
        expect(currentWorkingDirectory).toBe(process.cwd());

        return process.cwd();
      }
    );
    expect(process.cwd()).toBe(cwd);
    expect(result).toBe(fixturesPath);
  });

  it("should await promises before returning a result", async () => {
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

describe("readVersion", () => {
  it("should read the package version", async () => {
    const version = await readVersion();
    expect(typeof version).toBe("string");
  });
});

describe("readConfig", () => {
  it("should read the config file", async () => {
    const config = await readConfig(
      path.join(fixturesPath, "./ascaid.config.json")
    );

    expect(config).toMatchObject({
      extensions: expect.arrayContaining([expect.any(String)]),
      asciidoctorOptions: expect.any(Object),
    });
  });
});
