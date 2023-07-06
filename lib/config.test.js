import { fileURLToPath } from "node:url";
import path from "node:path";

import { readConfig, findConfigFile } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, "./__fixtures__");

describe("readConfig", () => {
  it("should read the config file", async () => {
    const config = await readConfig(
      path.join(fixturesPath, "./valid-config.json"),
    );

    expect(config).toMatchObject({
      extensions: expect.arrayContaining([expect.any(String)]),
      asciidoctorOptions: expect.any(Object),
    });
  });

  it("should support overriding attributes", async () => {
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

  it("should throw an error if the config file is invalid", async () => {
    await expect(
      readConfig(path.join(fixturesPath, "./invalid-config.json")),
    ).rejects.toThrowError("Invalid config file");
  });
});

describe("findConfigFile", () => {
  it("should return the path to the specified config file when the file exists", async () => {
    const configFilePath = await findConfigFile(
      path.join(fixturesPath, "./valid-config.json"),
    );

    expect(configFilePath).toBe(path.join(fixturesPath, "./valid-config.json"));
  });

  it("should throw anc error when the specified file does not exist", async () => {
    const configFilePath = path.join(fixturesPath, "./non-existent.json");
    await expect(findConfigFile(configFilePath)).rejects.toThrowError(
      `Config file not found: ${configFilePath}`,
    );
  });

  it("should try 2 paths before giving up", async () => {
    const mockFileExists = jest.fn(() => Promise.resolve(false));

    const configFilePath = await findConfigFile(undefined, mockFileExists);

    expect(configFilePath).toBeUndefined();
    expect(mockFileExists).toHaveBeenCalledTimes(2);
  });
});
