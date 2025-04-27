import {
  ASCIIDOCTOR_MESSAGE_SEVERITY,
  adoctor,
  memoryLogger,
} from "./asciidoctor.js";

const defaultAdoctorOptions = {
  safe: "server",
  doctype: "book",
  standalone: true,
};

const getNumericAsciidoctorMessageSeverity = (message) => {
  return (
    ASCIIDOCTOR_MESSAGE_SEVERITY[message.getSeverity().toUpperCase()] ??
    ASCIIDOCTOR_MESSAGE_SEVERITY.WARN
  );
};

export const adocConvert = async (adoc, adoctorOptions = {}) => {
  const mergedAdoctorOptions = { ...defaultAdoctorOptions, ...adoctorOptions };
  const html = adoctor.convert(adoc, mergedAdoctorOptions);

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
      ASCIIDOCTOR_MESSAGE_SEVERITY.WARN,
  );
  if (errors.length > 0) {
    throw new Error("Asciidoc conversion failed");
  }

  return html;
};
