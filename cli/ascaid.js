import { program } from "commander";
import { readVersion } from "../lib/utils.js";
import { checkPandoc } from "../lib/pandoc-convert.js";

const main = async () => {
  const version = await readVersion();

  await checkPandoc();

  program
    .version(version)
    .description("A collection of AsciiDoc tools")
    .command("serve [directory]", "start an AsciiDoc server")
    .command(
      "adoc-to-gfm <srcDir> <outDir>",
      "AsciiDoc -> GitHub flavored markdown"
    )
    .command(
      "gfm-to-confluence <dir>",
      "Publish a GitHub flavored markdown directory to Confluence"
    );

  await program.parseAsync(process.argv);
};

main().catch((error) => {
  console.error(error);

  process.exit(-1);
});
