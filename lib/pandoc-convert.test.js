import { test } from "node:test";
import { ExecaError } from "execa";
import { expect } from "expect";
import { checkPandoc, pandocConvert } from "./pandoc-convert.js";

await test("checkPandoc", async (t) => {
  await t.test("pass when pandoc is in path", async () => {
    await checkPandoc();
  });

  await t.test("fail when pandoc is not in path", async (t) => {
    const previousPath = process.env.PATH;
    process.env.PATH = "";
    await expect(checkPandoc()).rejects.toThrowError();
    process.env.PATH = previousPath;
  });
});

await test("pandocConvert", async (t) => {
  await t.test("pass when input is valid", async () => {
    const html = await pandocConvert("# Hello", "gfm", "html");
    expect(html).toBe('<h1 id="hello">Hello</h1>');
  });

  await t.test("fail when input is not valid", async () => {
    const error = await pandocConvert("# Hello", "invalid", "invalid").catch(
      (error) => error,
    );

    expect(error).toBeInstanceOf(ExecaError);
  });
});
