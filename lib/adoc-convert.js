import asciidoctor from '@asciidoctor/core';
import kroki from 'asciidoctor-kroki';
import adocOAS from './adoc-oas-extension.js';

const ASCIIDOCTOR_MESSAGE_SEVERITY = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
};

const getNumericAsciidoctorMessageSeverity = (message) => {
  return ASCIIDOCTOR_MESSAGE_SEVERITY[message.getSeverity().toUpperCase()] ?? ASCIIDOCTOR_MESSAGE_SEVERITY.WARN;
};

const adoctor = asciidoctor();
const memoryLogger = adoctor.MemoryLogger.$new();
adoctor.LoggerManager.setLogger(memoryLogger);
kroki.register(adoctor.Extensions);
adocOAS.register(adoctor.Extensions);

export const adocConvert = async (adoc) => {
  const html = adoctor.convert(adoc, { safe: 'server', doctype: 'book', 'header_footer': true });

  const messages = memoryLogger.getMessages();
  messages.forEach((message) => {
    if (getNumericAsciidoctorMessageSeverity(message) > ASCIIDOCTOR_MESSAGE_SEVERITY.INFO) {
      console.error(message);
    } else {
      console.log(message);
    }
  });

  const errors = messages.filter(
    (message) => getNumericAsciidoctorMessageSeverity(message) > ASCIIDOCTOR_MESSAGE_SEVERITY.WARN,
  );
  if (errors.length > 0) {
    throw new Error('Asciidoc conversion failed');
  }

  return html;
};
