import path from "node:path";
import asciidoctor from "@asciidoctor/core";

export const ASCIIDOCTOR_MESSAGE_SEVERITY = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
};

export const adoctor = asciidoctor();
export const memoryLogger = adoctor.MemoryLogger.$new();
adoctor.LoggerManager.setLogger(memoryLogger);

const shouldResolveAsPath = (string_) => {
  if (path.isAbsolute(string_) || /^([A-Za-z]:)/.test(string_)) {
    return false;
  }

  return string_.startsWith(".");
};

export const registerExtensions = async (extensions, dir) => {
  for (const extensionPath of extensions) {
    const module = await (shouldResolveAsPath(extensionPath)
      ? import(path.join(dir, extensionPath))
      : import(extensionPath));

    await Promise.resolve(
      (module.register ?? module.default.register)(adoctor.Extensions)
    );
  }
};
