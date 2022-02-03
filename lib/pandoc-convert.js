import { Readable } from "node:stream";
import { execa } from "execa";

const streamToString = async (stream) => {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
};

export const checkPandoc = async () => {
  try {
    await execa("pandoc", ["--version"]);
  } catch {
    throw new Error(
      "Pandoc check failed! Make sure Pandoc is installed and on your path"
    );
  }
};

export const pandocConvert = async (
  content,
  from,
  to,
  additionalArguments = []
) => {
  const contentStream = Readable.from(content);

  const pandoc = execa("pandoc", [
    ...additionalArguments,
    "--from",
    from,
    "--to",
    to,
    "--output",
    "-",
  ]);
  contentStream.pipe(pandoc.stdin);
  const out = await streamToString(pandoc.stdout);

  return new Promise((resolve, reject) => {
    pandoc.on("exit", (code) => {
      if (code !== 0) {
        return reject(new Error("Pandoc exited with a non-zero status code"));
      }

      return resolve(out);
    });
  });
};
