import { describe, expect, it } from "@jest/globals";
import { checkPandoc, pandocConvert } from "./pandoc-convert.js";

describe("checkPandoc", () => {
  describe("when pandoc is in path", () => {
    it("should proceed without throwing errors", async () => {
      await checkPandoc();
    });
  });

  describe("when pandoc is not in path", () => {
    let previousPath;

    beforeAll(() => {
      previousPath = process.env.PATH;
      process.env.PATH = "";
    });

    afterAll(() => {
      process.env.PATH = previousPath;
    });

    it("should throw an error", async () => {
      await expect(checkPandoc()).rejects.toThrowError();
    });
  });
});

describe("pandocConvert", () => {
  describe("when input is valid", () => {
    it("should convert input to the output", async () => {
      const html = await pandocConvert("# Hello", "gfm", "html");
      expect(html).toBe('<h1 id="hello">Hello</h1>\n');
    });
  });

  describe("when input is not valid", () => {
    it("should throw an error", async () => {
      const error = await pandocConvert("# Hello", "invalid", "invalid").catch(
        (error) => error
      );
      expect(error).toBeInstanceOf(Error);
    });
  });
});
