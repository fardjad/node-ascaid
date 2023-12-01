import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { expect } from "expect";

import { createAsciidocMiddleware } from "./adoc-server.js";
import { invokeInDir } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, "__fixtures__");

await test("AsciidocMiddleware", async (t) => {
  const middleware = createAsciidocMiddleware(fixturesPath);

  await t.test("transform asciidoc files", async (t) => {
    const request = {
      url: "/doc.adoc",
      headers: {
        host: "localhost",
      },
    };

    const res = {
      statusCode: 0,
      setHeader: t.mock.fn(),
      end: t.mock.fn(),
    };

    const callback = t.mock.fn();

    await invokeInDir(fixturesPath, () => {
      return middleware(request, res, callback);
    });

    expect(callback.mock.callCount()).toBe(0);
    expect(res.statusCode).toBe(200);
    const responseBody = res.end.mock.calls[0].arguments[0];
    expect(responseBody).toContain("<!DOCTYPE html>");
  });

  await t.test(
    "call the next middleware when the request path is not an asciidoc file",
    async (t) => {
      const request = {
        url: "/something.notadoc",
        headers: {
          host: "localhost",
        },
      };

      const res = {
        statusCode: 0,
        setHeader: t.mock.fn(),
        end: t.mock.fn(),
      };

      const callback = t.mock.fn();

      await invokeInDir(fixturesPath, () => {
        return middleware(request, res, callback);
      });

      expect(callback.mock.callCount()).toBe(1);
      expect(res.statusCode).toBe(0);
      expect(res.setHeader.mock.callCount()).toBe(0);
      expect(res.end.mock.callCount()).toBe(0);
    },
  );
});
