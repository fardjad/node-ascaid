import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { expect } from "@jest/globals";

import { adocConvert } from "./adoc-convert.js";
import { invokeInDir } from "./utils.js";
import { registerExtensions } from "./asciidoctor";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, "__fixtures__");

describe("adocConvert", () => {
  beforeAll(async () => {
    await registerExtensions([], path.resolve("."));
  });

  it("should convert an adoc document to HTML and support extensions", async () => {
    const input = await fs.promises.readFile(
      path.join(fixturesPath, "./doc.adoc"),
      { encoding: "utf8" }
    );
    const html = await invokeInDir(fixturesPath, async () => {
      return adocConvert(input);
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("kroki");
  });
});
