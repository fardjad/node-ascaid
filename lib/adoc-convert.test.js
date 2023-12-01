import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { test } from "node:test";
import { expect } from "expect";

import { adocConvert } from "./adoc-convert.js";
import { invokeInDir } from "./utils.js";
import { registerExtensions } from "./asciidoctor.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, "__fixtures__");

await test("adocConvert", async () => {
  await registerExtensions(["asciidoctor-kroki"], path.resolve("."));

  const input = await fs.promises.readFile(
    path.join(fixturesPath, "./doc.adoc"),
    { encoding: "utf8" },
  );
  const html = await invokeInDir(fixturesPath, async () => {
    return adocConvert(input);
  });

  expect(html).toContain("<!DOCTYPE html>");
  expect(html).toContain("kroki");
});
