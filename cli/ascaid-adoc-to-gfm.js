import { Argument, Option, program } from "commander";
import { promisify } from "node:util";
import globcb from "glob";
import path from "node:path";
import fs from "node:fs";
import { adocConvert } from "../lib/adoc-convert.js";
import { pandocConvert } from "../lib/pandoc-convert.js";
import { invokeInDir, readConfig, readVersion } from "../lib/utils.js";
import { registerExtensions } from "../lib/asciidoctor.js";

const glob = promisify(globcb);

export const adocToGfm = async (srcDir, outDir, ignore) => {
  const matches = await glob("**/*.{asciidoc,adoc,asc}", {
    nocase: true,
    cwd: srcDir,
    ignore,
  });

  for (const fileName of matches) {
    const dirname = path.dirname(fileName);

    const writeDir = path.join(outDir, dirname);
    await fs.promises.mkdir(writeDir, { recursive: true });

    const adoc = await fs.promises.readFile(path.join(srcDir, fileName), {
      encoding: "utf-8",
    });

    const readDir = path.join(srcDir, dirname);
    const html = await invokeInDir(readDir, () => {
      return adocConvert(adoc);
    });
    const gfm = await pandocConvert(html, "html", "gfm");

    const basename = path.basename(fileName);
    const fileNameWithoutExtension = basename.slice(
      0,
      Math.max(0, basename.length - path.extname(basename).length)
    );
    await fs.promises.writeFile(
      path.join(writeDir, `${fileNameWithoutExtension}.md`),
      gfm,
      { encoding: "utf-8" }
    );
  }
};

const main = async () => {
  const version = await readVersion();

  program
    .version(version)
    .addArgument(new Argument("<srcDir>", "source directory"))
    .addArgument(new Argument("<outDir>", "output directory"))
    .addOption(
      new Option("--ignore [ignore...]", "glob patterns to ignore").default([
        "**/_*",
      ])
    )
    .description(
      "Recursively convert AsciiDoc files in a directory to GitHub flavored markdown"
    )
    .action(async (srcDir, outDir, { ignore }) => {
      const config = await readConfig();
      await registerExtensions(config.extensions, path.resolve("."));

      await adocToGfm(srcDir, outDir, ignore);
    });

  await program.parseAsync(process.argv);
};

main().catch((error) => {
  console.error(error);

  process.exit(-1);
});
