<div id="header">

</div>

<div id="content">

<div class="sect1">

## ascaid: a collection of AsciiDoc tools

<div class="sectionbody">

<div class="imageblock kroki">

<div class="content">

![Diagram](https://kroki.io/svgbob/svg/eNpNTcENwEAI-t8ULNC6EIkdxOErYpPGBAQ5DshMQNhsHOV96SCQYKP04KjGaoEWOtQJRBIknuu6S3nGeihPt_lNTWgOkLLngcpWBPVlQMQvUO1MWR6mFqWUM633c14_tUAd)

</div>

</div>

<div class="sect2">

### Description

<div class="paragraph">

**ascade** is a CLI tool for writing and publishing [AsciiDoc](https://asciidoctor.org) files. It uses [Asciidoctor.js](https://docs.asciidoctor.org/asciidoctor.js/latest) and [Pandoc](https://pandoc.org) under the hood and has the following main features:

</div>

<div class="ulist">

-   It can be configured to load [Asciidoctor.js Extensions](https://docs.asciidoctor.org/asciidoctor.js/latest/extend/extensions/ecosystem)

-   It includes a live server to help with writing AsciiDoc documents

-   It can convert Asciidoc files to [GitHub Flavored Markdown](https://github.github.com/gfm)

-   It can publish GitHub Flavored Markdown files to [Confluence](https://www.atlassian.com/software/confluence)

</div>

<div class="paragraph">

The following diagram shows a typical document writing and publishing workflow with **ascaid**.

</div>

<div class="imageblock kroki">

<div class="content">

![Diagram](https://kroki.io/mermaid/svg/eNpdj8FqwzAMhu99CmEI2aDJA_QwKClNDikb7WGH0INnq6lYYg9bSQ-l7z47ycbY6Zcs-f8_JcmdDPEG7ilfscd0kxoc2MkufTySZNU6-XWF-rgCeHfE6Bqxs2ro0fDyIM6QZXPtQ_UC291rEdajxIn0SpIGj27EaV7TiG8OR8JbI2IDSyfOy7dGbL0iCkHwE-bnmMVMaqsytll76SfLcn9oRElcDR-w7-RoHWo4SPep7c389yiRPTg0GuMWmcnhWJ0aUViNUFnPZFo4BWBS4aYnyjGH2X0dtZZBkVX-HIgDckj_wxaYIpqy5tINaNR8dPHbfgOxF3Zk)

</div>

</div>

<div class="paragraph">

*Note: This document is generated with* ***ascaid***. *Check out the source [here](https://github.com/fardjad/node-ascaid/tree/master/adocs/).*

</div>

</div>

<div class="sect2">

### Requirements

<div class="olist arabic">

1.  A Unix-like operating system ([WSL](https://docs.microsoft.com/en-us/windows/wsl) is also supported)

2.  [Bash](https://www.gnu.org/software/bash)

3.  [Node.js v16+](https://nodejs.org)

4.  [Pandoc](https://pandoc.org)

</div>

</div>

<div class="sect2">

### Installation

<div class="paragraph">

You can install the package globally with npm:

</div>

<div class="listingblock">

<div class="content">

    npm install -g ascaid

</div>

</div>

</div>

<div class="sect2">

### Commands

<div class="sect3">

#### `ascaid help`

<div class="literalblock">

<div class="content">

    Usage: ascaid [options] [command]

    A collection of AsciiDoc tools

    Options:
      -V, --version                  output the version number
      -h, --help                     display help for command

    Commands:
      serve [directory]              start an AsciiDoc server
      adoc-to-gfm <srcDir> <outDir>  AsciiDoc -> GitHub flavored markdown
      gfm-to-confluence <dir>        Publish a GitHub flavored markdown directory
                                     to Confluence
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
      rootDir        server root directory (default: current directory)

    Options:
      -V, --version  output the version number
      -h, --help     display help for command

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
      srcDir                source directory
      outDir                output directory

    Options:
      -V, --version         output the version number
      --ignore [ignore...]  glob patterns to ignore (default: ["**/_*"])
      -h, --help            display help for command

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
      --api-base-url [apiBaseUrl]        Confluence API base URL (default:
                                         CONFLUENCE_API_BASE_URL environment
                                         variable)
      --api-username [apiUsername]       Confluence API username (default:
                                         CONFLUENCE_API_USERNAME environment
                                         variable)
      --api-password [apiPassword]       Confluence API password (default:
                                         CONFLUENCE_API_USERNAME environment
                                         variable)
      --space-key [spaceKey]             Confluence space key (default:
                                         CONFLUENCE_SPACE_KEY environment variable)
      --root-page-id [rootPageId]        Confluence root page ID (default:
                                         CONFLUENCE_ROOT_PAGE_ID environment
                                         variable)
      --root-page-title [rootPageTitle]  Confluence root page title (default:
                                         CONFLUENCE_ROOT_PAGE_TITLE environment
                                         variable)
      -h, --help                         display help for command

</div>

</div>

</div>

</div>

<div class="sect2">

### Config File

<div class="paragraph">

You can configure **ascaid** to load additional extensions by creating a file named `ascaid.config.json` in the current working directory. An example can be found [here](https://github.com/fardjad/node-ascaid/tree/master/examples/asciidoctor-extension).

</div>

<div class="paragraph">

[Asciidoctor Kroki Extension](https://github.com/Mogztter/asciidoctor-kroki) is included by default for convenience.

</div>

</div>

<div class="sect2">

### GitHub Actions Usage

<div class="paragraph">

To publish documents to confluence you’ll need to create an [API token](https://id.atlassian.com/manage/api-tokens) and a root page to publish the documents under.

</div>

<div class="paragraph">

An example [GitHub Actions](https://docs.github.com/actions) YAML file can be found [here](https://github.com/fardjad/node-ascaid/tree/master/examples/github-actions-public-to-confluence/public-docs.yml).

</div>

</div>

</div>

</div>

</div>

<div id="footer">

<div id="footer-text">

Last updated 2022-03-04 19:56:27 +0100

</div>

</div>
