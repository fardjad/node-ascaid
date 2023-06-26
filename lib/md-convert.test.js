import { mdConvert } from "./md-convert.js";

describe("mdConvert", () => {
  describe("when config is valid", () => {
    it("should convert input to the output", async () => {
      const html = await mdConvert("# Hello");
      expect(html).toBe('<h1 id="hello">Hello</h1>\n');
    });
  });

  describe("when config is not valid", () => {
    it("should throw an error", async () => {
      const error = await mdConvert("# Hello", {
        pandocReadFormat: "non-existent",
      }).catch((error) => error);
      expect(error).toBeInstanceOf(Error);
    });
  });
});
