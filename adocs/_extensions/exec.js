/* eslint-disable no-invalid-this */

import execa from "execa";

export const register = (registry) => {
  registry.register(function () {
    this.blockMacro("exec", async function () {
      this.process((parent, target, attrs) => {
        const [command, ...args] = attrs.command.split(/\s+/g);
        const result = execa.sync(command, args);
        return this.createLiteralBlock(parent, result.stdout);
      });
    });
  });

  return registry;
};

export default {
  register,
};
