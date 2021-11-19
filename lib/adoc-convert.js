import {
  adoctor,
  ASCIIDOCTOR_MESSAGE_SEVERITY,
  memoryLogger,
} from "./asciidoctor.js";

const getNumericAsciidoctorMessageSeverity = (message) => {
  return (
    ASCIIDOCTOR_MESSAGE_SEVERITY[message.getSeverity().toUpperCase()] ??
    ASCIIDOCTOR_MESSAGE_SEVERITY.WARN
  );
};

export const adocConvert = async (adoc) => {
  const html = adoctor.convert(adoc, {
    safe: "server",
    doctype: "book",
    header_footer: true,
  });

  const messages = memoryLogger.getMessages();
  for (const message of messages) {
    if (
      getNumericAsciidoctorMessageSeverity(message) >
      ASCIIDOCTOR_MESSAGE_SEVERITY.INFO
    ) {
      console.error(message);
    } else {
      console.log(message);
    }
  }

  const errors = messages.filter(
    (message) =>
      getNumericAsciidoctorMessageSeverity(message) >
      ASCIIDOCTOR_MESSAGE_SEVERITY.WARN
  );
  if (errors.length > 0) {
    throw new Error("Asciidoc conversion failed");
  }

  return html;
};
