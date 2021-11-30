import path from "node:path";
import { Argument, program } from "commander";

import { startAsciidocServer } from "../index.js";
import { readConfig, readVersion } from "../index.js";
import { registerExtensions } from "../index.js";

const main = async () => {
  const version = await readVersion();

  program
    .version(version)
    .addArgument(
      new Argument("[rootDir]", "server root directory").default(
        ".",
        "current directory"
      )
    )
    .description("Start an AsciiDoc server")
    .action(async (rootDir) => {
      const config = await readConfig();
      await registerExtensions(config.extensions, path.resolve("."));

      await startAsciidocServer(rootDir);
    });

  await program.parseAsync(process.argv);
};

main().catch((error) => {
  console.error(error);

  process.exit(-1);
});
