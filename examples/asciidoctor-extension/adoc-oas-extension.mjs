import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import makeSynchronous from "make-synchronous";
import YAML from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const oasToHtmlSync = makeSynchronous(async (contents) => {
  const converter = await import("widdershins");
  const { pandocConvert } = await import("ascaid");

  const originalLog = console.log;
  // Reduce console noise
  console.log = () => undefined;

  const md = await converter.convert(contents, {
    yaml: true,
    codeSamples: true,
    httpsnippet: true,
    language_tabs: [{ http: "HTTP" }, { shell: "curl" }],
    language_clients: [{ shell: "curl" }],
  });

  console.log = originalLog;

  return await pandocConvert(md, "gfm", "html");
});

/**
 * Register an Asciidoctor extension that replaces
 * `oas::[path=/path/to/openapi.yml]` with an HTML rendered with widdershins.
 */
export const register = (registry) => {
  registry.register(function () {
    this.blockMacro("oas", async function () {
      this.process((parent, target, attrs) => {
        if (!fs.existsSync(attrs.path)) {
          throw new Error("Cannot find the OAS file");
        }

        const oas = YAML.parse(
          fs.readFileSync(attrs.path, { encoding: "utf-8" }),
        );

        const cwd = process.cwd();
        process.chdir(__dirname);
        const html = oasToHtmlSync(oas);
        process.chdir(cwd);

        return this.createPassBlock(parent, html);
      });
    });
  });

  return registry;
};

export default {
  register,
};
