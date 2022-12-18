import ConfluenceApi from "confluence-api";
import pify from "pify";

export class ConfluenceClient {
  #confluenceClient;
  #spaceKey;
  #rootPageId;

  static normalizeBaseUrl = (apiBaseUrl) => {
    const parsedUrl = new URL(apiBaseUrl);
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/+$/, "");
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/+/g, "/");
    // backward compatibility with <=v1.4.12
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/rest\/api$/, "");

    return parsedUrl.toString();
  };

  constructor({ apiUsername, apiPassword, apiBaseUrl, spaceKey, rootPageId }) {
    this.#confluenceClient = pify(
      new ConfluenceApi({
        username: apiUsername,
        password: apiPassword,
        baseUrl: ConfluenceClient.normalizeBaseUrl(apiBaseUrl),
      })
    );

    this.#spaceKey = spaceKey;
    this.#rootPageId = rootPageId;
  }

  async createConfluencePage(page, confluenceParentPageId) {
    // in Confluence, page names have to be unique within a space
    let cql = `cql=type=page AND space="${
      this.#spaceKey
    }" AND title="${encodeURIComponent(page.title)}"`;
    if (confluenceParentPageId) {
      cql = `${cql} AND ancestor in (${confluenceParentPageId})`;
    }
    const searchResults = await this.#confluenceClient.search(cql);

    let confluencePage = searchResults.results[0]?.content;
    if (confluencePage) {
      confluencePage = await this.#confluenceClient.getContentById(
        confluencePage.id
      );
      console.log(
        `Updating page: title="${page.title}", id=${confluencePage.id}`
      );
      confluencePage = await this.#confluenceClient.putContent(
        this.#spaceKey,
        confluencePage.id,
        confluencePage.version.number + 1,
        page.title,
        page.body
      );
    } else {
      const parentId = confluenceParentPageId ?? this.#rootPageId;
      console.log(`Creating page: title="${page.title}", parentId=${parentId}`);
      confluencePage = await this.#confluenceClient.postContent(
        this.#spaceKey,
        page.title,
        page.body,
        parentId
      );
    }

    for (const childPage of page.children) {
      await this.createConfluencePage(childPage, confluencePage.id);
    }
  }
}
