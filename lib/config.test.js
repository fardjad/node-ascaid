import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { expect } from "expect";

import { findConfigFile, readConfig } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, "./__fixtures__");

await test("readConfig", async (t) => {
  await t.test("read the config file", async () => {
    const config = await readConfig(
      path.join(fixturesPath, "./valid-config.json"),
    );

    expect(config).toMatchObject({
      extensions: expect.arrayContaining([expect.any(String)]),
      asciidoctorOptions: expect.any(Object),
    });
  });

  await t.test("support overriding attributes", async () => {
    const config = await readConfig(
      path.join(fixturesPath, "./valid-config.json"),
      ["this-should-be-overridden=overridden", "this-should-be-deleted"],
    );

    expect(config).toMatchObject({
      extensions: expect.arrayContaining([expect.any(String)]),
      asciidoctorOptions: expect.objectContaining({
        attributes: expect.objectContaining({
          "this-should-be-overridden": "overridden",
          "this-should-be-deleted": undefined,
        }),
      }),
    });
  });

  await t.test("thow an error when the config file is invalid", async () => {
    await expect(
      readConfig(path.join(fixturesPath, "./invalid-config.json")),
    ).rejects.toThrowError("Invalid config file");
  });
});

await test("findConfigFile", async (t) => {
  await t.test(
    "return the path to the specified config file when the file exists",
    async () => {
      const configFilePath = await findConfigFile(
        path.join(fixturesPath, "./valid-config.json"),
      );

      expect(configFilePath).toBe(
        path.join(fixturesPath, "./valid-config.json"),
      );
    },
  );

  await t.test(
    "throw an error when the specified file does not exist",
    async () => {
      const configFilePath = path.join(fixturesPath, "./non-existent.json");
      await expect(findConfigFile(configFilePath)).rejects.toThrowError(
        `Config file not found: ${configFilePath}`,
      );
    },
  );

  await t.test("try .json and .jsonc", async (t) => {
    const mockFileExists = t.mock.fn(() => Promise.resolve(false));

    const configFilePath = await findConfigFile(undefined, mockFileExists);

    expect(configFilePath).toBeUndefined();
    expect(mockFileExists.mock.calls.length).toBe(2);
  });
});
