import path from "node:path";
import { Argument, program } from "commander";

import { startAsciidocServer } from "../index.js";
import { readConfig, readVersion } from "../index.js";
import { registerExtensions } from "../index.js";

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
    const { extensions, asciidoctorOptions: adoctorOptions } =
      await readConfig();
    await registerExtensions(extensions ?? [], path.resolve("."));

    await startAsciidocServer(rootDir, adoctorOptions);
  });

await program.parseAsync(process.argv);
