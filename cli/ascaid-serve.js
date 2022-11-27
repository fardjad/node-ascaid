import path from "node:path";
import { Argument, program } from "commander";

import { startAsciidocServer } from "../index.js";
import { readConfig, readVersion } from "../index.js";
import { registerExtensions } from "../index.js";
import { attributeOption, configOption } from "./common-options.js";

const version = await readVersion();

program
  .version(version)
  .addArgument(
    new Argument("[rootDir]", "server root directory").default(
      ".",
      "current directory"
    )
  )
  .addOption(configOption)
  .addOption(attributeOption)
  .description("Start an AsciiDoc server")
  .action(async (rootDir, { config, attribute }) => {
    const { extensions, asciidoctorOptions } = await readConfig(
      config,
      attribute
    );
    await registerExtensions(extensions ?? [], path.resolve("."));

    await startAsciidocServer(rootDir, asciidoctorOptions);
  });

await program.parseAsync(process.argv);
