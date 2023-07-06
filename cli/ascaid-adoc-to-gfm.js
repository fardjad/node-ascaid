import { Argument, Option, program } from "commander";
import { globSync } from "glob";
import path from "node:path";
import fs from "node:fs";

import { adocConvert } from "../index.js";
import { pandocConvert } from "../index.js";
import { invokeInDir, readConfig, readVersion } from "../index.js";
import { registerExtensions } from "../lib/asciidoctor.js";
import { attributeOption, configOption } from "./common-options.js";

export const adocToGfm = async (srcDir, outDir, ignore, adoctorOptions) => {
  const matches = globSync("**/*.{asciidoc,adoc,asc}", {
    nocase: true,
    cwd: srcDir,
    ignore,
  });

  for (const fileName of matches) {
    const dirname = path.dirname(fileName);

    const writeDir = path.join(outDir, dirname);
    await fs.promises.mkdir(writeDir, { recursive: true });

    const adoc = await fs.promises.readFile(path.join(srcDir, fileName), {
      encoding: "utf8",
    });

    const readDir = path.join(srcDir, dirname);
    const html = await invokeInDir(readDir, () => {
      return adocConvert(adoc, adoctorOptions);
    });
    const gfm = await pandocConvert(html, "html", "gfm", ["--wrap=none"]);

    const basename = path.basename(fileName);
    const fileNameWithoutExtension = basename.slice(
      0,
      Math.max(0, basename.length - path.extname(basename).length),
    );
    await fs.promises.writeFile(
      path.join(writeDir, `${fileNameWithoutExtension}.md`),
      gfm,
      { encoding: "utf8" },
    );
  }
};

const version = await readVersion();

program
  .version(version)
  .addArgument(new Argument("<srcDir>", "source directory"))
  .addArgument(new Argument("<outDir>", "output directory"))
  .addOption(
    new Option("--ignore [globPattern...]", "glob patterns to ignore").default([
      "**/_*",
    ]),
  )
  .addOption(configOption)
  .addOption(attributeOption)
  .description(
    "Recursively convert AsciiDoc files in a directory to GitHub flavored markdown",
  )
  .action(async (srcDir, outDir, { ignore, config, attribute }) => {
    const { extensions, asciidoctorOptions: adoctorOptions } = await readConfig(
      config,
      attribute,
    );
    await registerExtensions(extensions ?? [], path.resolve("."));

    await adocToGfm(srcDir, outDir, ignore, adoctorOptions);
  });

await program.parseAsync(process.argv);
