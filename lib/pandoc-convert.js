import { $ } from "execa";

export const checkPandoc = async () => {
  try {
    await $`pandoc --version`;
  } catch {
    throw new Error(
      "Pandoc check failed! Make sure Pandoc is installed and on your path",
    );
  }
};

export const pandocConvert = async (
  content,
  from,
  to,
  additionalArguments = [],
) => {
  const { stdout } = await $({
    input: content,
  })`pandoc ${additionalArguments} --from ${from} --to ${to} --output -`;

  return stdout;
};
