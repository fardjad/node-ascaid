<div id="header">

</div>

<div id="content">

<div id="preamble">

<div class="sectionbody">

<div class="imageblock">

<div class="content">

![Banner](https://github.com/fardjad/node-ascaid/blob/master/media/banner.png?raw=true)

</div>

</div>

</div>

</div>

<div class="sect1">

## ascaid

<div class="sectionbody">

<div class="paragraph">

<span class="image"><a href="https://www.npmjs.com/package/ascaid" class="image"><img src="https://img.shields.io/npm/v/ascaid" alt="ascaid" /></a></span> <span class="image"><a href="https://www.npmjs.com/package/ascaid" class="image"><img src="https://img.shields.io/npm/dm/ascaid" alt="ascaid" /></a></span> <span class="image"><a href="https://github.com/fardjad/node-ascaid/actions" class="image"><img src="https://img.shields.io/github/actions/workflow/status/fardjad/node-ascaid/test-and-release.yml?branch=master" alt="test and release" /></a></span>

</div>

<div class="paragraph">

Hassle-free documentation generation powered by AsciiDoc

</div>

<div class="sect2">

### TL;DR

<div class="paragraph">

⚡️ Write documents in [AsciiDoc](https://asciidoctor.org) format

</div>

<div class="paragraph">

⚡️ Include text-based diagrams in your documents:

</div>

<div class="imageblock">

<div class="content">

<img src="https://github.com/fardjad/node-ascaid/blob/master/media/diagram-example.png?raw=true" style="width:80.0%" alt="diagram example" />

</div>

</div>

<div class="paragraph">

⚡️ Extend AsciiDoc with custom extensions:

</div>

<div class="imageblock">

<div class="content">

<img src="https://github.com/fardjad/node-ascaid/blob/master/media/custom-extension-example.png?raw=true" style="width:80.0%" alt="custom extension example" />

</div>

</div>

<div class="imageblock">

<div class="content">

<img src="https://github.com/fardjad/node-ascaid/blob/master/media/exec-extension-example.png?raw=true" style="width:80.0%" alt="exec extension example" />

</div>

</div>

<div class="paragraph">

⚡️ Publish your documents to Confluence and code hosting services

</div>

</div>

<div class="sect2">

### Longer Description

<div class="paragraph">

**ascaid** makes it easy to write partially-generated documentation in AsciiDoc format. Generating the documentation can help with reducing [documentation CRUFT](http://agilemodeling.com/essays/agileDocumentation.htm).

</div>

<div class="paragraph">

Under the hood, **ascaid** uses [Asciidoctor.js](https://docs.asciidoctor.org/asciidoctor.js/latest) and [Pandoc](https://pandoc.org) and offers the following main features:

</div>

<div class="ulist">

- It can be configured to load [Asciidoctor.js Extensions](https://docs.asciidoctor.org/asciidoctor.js/latest/extend/extensions/ecosystem)

- It includes a live server to help with writing AsciiDoc documents

- It can convert Asciidoc files to [GitHub Flavored Markdown](https://github.github.com/gfm)

- It can publish GitHub Flavored Markdown files to [Confluence](https://www.atlassian.com/software/confluence)

</div>

<div class="paragraph">

The following diagram shows a typical document writing and publishing workflow with **ascaid**.

</div>

<div class="imageblock kroki">

<div class="content">

![Diagram](https://kroki.io/mermaid/png/eNpdkc1uwjAMx-99CitSxyatPACTJqEi6AG0aRx2qDikiSkWNEFJWg6Id5_Tlg3t5I84f_9sp-mVDIUZXCfhgA1OZhMt3XFyu6VpktROng-w_koAvh0FdKVYWNU2aMKYEDvIssH37L3DfPGRc3k08UV6JUmDR9dh_76mDj8ddoSXUsQAxkjsxm-lmHtFxI3g3swPbUYxqa3Kgs3qfdNLrpabUqwoFG0Fy5PsrEMNG55C24v5r7HC4MGh0RiryPQKebEtRW41QmF9IFPDloFJ8UzPNMUpDOqv0a4lWwxq-sLEjMzdH9iYKaIpa_anFo0ahs5_wyRJUyikOkKw0MgjAq8dNEledQMNo0NHnqoTRrZ4Cqi4una2Ndonvq2Gm4gnU_nzm2CA-216d1x_j9VbHq23D3sf8n9IvIwf1giieg==)

</div>

</div>

<div class="paragraph">

*Note: This document is generated with* ***ascaid*** *itself.* *Check out the source [here](https://github.com/fardjad/node-ascaid/blob/master/adocs/README.adoc).*

</div>

</div>

<div class="sect2">

### Installation

<div class="sect3">

#### Requirements

<div class="olist arabic">

1.  A Unix-like operating system ([WSL](https://docs.microsoft.com/en-us/windows/wsl) is also supported)

2.  [Bash](https://www.gnu.org/software/bash)

3.  [Node.js](https://nodejs.org)

4.  [Pandoc](https://pandoc.org)

</div>

<div class="paragraph">

You can install the package globally with npm:

</div>

<div class="listingblock">

<div class="content">

    npm install -g ascaid

</div>

</div>

</div>

</div>

<div class="sect2">

### CLI Usage

<div class="sect3">

#### `ascaid help`

<div class="literalblock">

<div class="content">

    Usage: ascaid [options] [command]

    Hassle-free documentation generation powered by AsciiDoc

    Options:
      -V, --version                  output the version number
      -h, --help                     display help for command

    Commands:
      serve [directory]              start an AsciiDoc server
      adoc-to-gfm <srcDir> <outDir>  AsciiDoc -> GitHub flavored markdown
      gfm-to-confluence <dir>        Publish a GitHub flavored markdown directory to
                                     Confluence
      help [command]                 display help for command

</div>

</div>

</div>

<div class="sect3">

#### `ascaid serve`

<div class="literalblock">

<div class="content">

    Usage: ascaid-serve [options] [rootDir]

    Start an AsciiDoc server

    Arguments:
      rootDir                         server root directory (default: current
                                      directory)

    Options:
      -V, --version                   output the version number
      -c, --config <path>             config file path
      -a, --attribute [key=value...]  set a document attribute. The value given will
                                      override values from the config file. Passing
                                      the key without =value will unset the
                                      attribute (default: [])
      -h, --help                      display help for command

</div>

</div>

</div>

<div class="sect3">

#### `ascaid adoc-to-gfm`

<div class="literalblock">

<div class="content">

    Usage: ascaid-adoc-to-gfm [options] <srcDir> <outDir>

    Recursively convert AsciiDoc files in a directory to GitHub flavored markdown

    Arguments:
      srcDir                          source directory
      outDir                          output directory

    Options:
      -V, --version                   output the version number
      --ignore [globPattern...]       glob patterns to ignore (default: ["**/_*"])
      -c, --config <path>             config file path
      -a, --attribute [key=value...]  set a document attribute. The value given will
                                      override values from the config file. Passing
                                      the key without =value will unset the
                                      attribute (default: [])
      -h, --help                      display help for command

</div>

</div>

</div>

<div class="sect3">

#### `ascaid gfm-to-confluence`

<div class="literalblock">

<div class="content">

    Usage: ascaid-gfm-to-confluence [options] <dir>

    Recursively publish a GitHub flavored markdown directory to Confluence

    Arguments:
      dir                                dir to publish to Confluence

    Options:
      -V, --version                      output the version number
      --api-base-url [apiBaseUrl]        Confluence API base URL
      --api-username [apiUsername]       Confluence API username
      --api-password [apiPassword]       Confluence API password
      --space-key [spaceKey]             Confluence space key
      --root-page-id [rootPageId]        Confluence root page ID
      --root-page-title [rootPageTitle]  Confluence root page title
      -h, --help                         display help for command

</div>

</div>

</div>

</div>

<div class="sect2">

### Config File

<div class="paragraph">

You can optionally use a config file to register custom extensions and set [Asciidoctor.js](https://docs.asciidoctor.org/asciidoctor.js/latest) options. On startup, **ascaid** looks for a config file named `ascaid.config.json` or `ascaid.config.jsonc` in the current working directory. The following block shows an example config file:

</div>

<div class="listingblock">

<div class="content">

``` highlight
{
  // JSON comments will be striped out

  "$schema": "https://raw.githubusercontent.com/fardjad/node-ascaid/master/ascaid.config.schema.json",
  "extensions": [
    // npm i asciidoctor-kroki
    "asciidoctor-kroki",

    "./path/to/extension.js"
  ],

  // https://docs.asciidoctor.org/asciidoctor/latest/api/options/
  "asciidoctorOptions": {
    // https://docs.asciidoctor.org/asciidoc/latest/attributes/document-attributes-ref/
    "attributes": {
      "nofooter": true,
      "kroki-server-url": "http://my-server-url:port"
    }
  }
}
```

</div>

</div>

</div>

<div class="sect2">

### Extensions

<div class="paragraph">

**ascaid** supports [Asciidoctor.js Extensions](https://docs.asciidoctor.org/asciidoctor.js/latest/extend/extensions/ecosystem).

</div>

<div class="paragraph">

An example implementation of a custom extension can be found [here](https://github.com/fardjad/node-ascaid/blob/master/examples/asciidoctor-extension).

</div>

</div>

<div class="sect2">

### Publishing Documents to Confluence

<div class="paragraph">

In order to publish [AsciiDoc](https://asciidoctor.org) documents to [Confluence](https://www.atlassian.com/software/confluence), you should first convert them to [GitHub Flavored Markdown](https://github.github.com/gfm) (see [CLI Usage](#_cli_usage) for more info). Then you’ll need to create an [API token](https://id.atlassian.com/manage/api-tokens) and a root page to publish the documents under. An example project with GitHub Actions integration can be found [here](https://github.com/fardjad/node-ascaid/blob/master/examples/github-actions-publish-to-confluence).

</div>

</div>

</div>

</div>

</div>