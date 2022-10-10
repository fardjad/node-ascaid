import path from "node:path";
import { fileURLToPath } from "node:url";

import { createAsciidocMiddleware } from "./adoc-server.js";
import { invokeInDir } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(__dirname, "__fixtures__");

describe("AsciidocMiddleware", () => {
  const middleware = createAsciidocMiddleware(fixturesPath);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should transform asciidoc files", async () => {
    const request = {
      url: "/doc.adoc",
      headers: {
        host: "localhost",
      },
    };

    const res = {
      statusCode: 0,
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    const callback = jest.fn();

    await invokeInDir(fixturesPath, () => {
      return middleware(request, res, callback);
    });

    expect(callback).not.toBeCalled();
    expect(res.statusCode).toBe(200);
    const responseBody = res.end.mock.calls[0][0];
    expect(responseBody).toContain("<!DOCTYPE html>");
  });

  it("should call the next middleware when request path is not an asciidoc file", async () => {
    const request = {
      url: "/something.notadoc",
      headers: {
        host: "localhost",
      },
    };

    const res = {
      statusCode: 0,
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    const callback = jest.fn();

    await invokeInDir(fixturesPath, () => {
      return middleware(request, res, callback);
    });

    expect(callback).toBeCalled();
    expect(res.statusCode).toBe(0);
    expect(res.setHeader).not.toBeCalled();
    expect(res.end).not.toBeCalled();
  });
});
