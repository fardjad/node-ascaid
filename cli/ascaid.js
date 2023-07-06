import { program } from "commander";
import { readVersion } from "../index.js";
import { checkPandoc } from "../index.js";

const version = await readVersion();

await checkPandoc();

program
  .version(version)
  .description("Hassle-free documentation generation powered by AsciiDoc")
  .command("serve [directory]", "start an AsciiDoc server")
  .command(
    "adoc-to-gfm <srcDir> <outDir>",
    "AsciiDoc -> GitHub flavored markdown",
  )
  .command(
    "gfm-to-confluence <dir>",
    "Publish a GitHub flavored markdown directory to Confluence",
  );

await program.parseAsync(process.argv);
