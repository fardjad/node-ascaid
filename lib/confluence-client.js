import axios from 'axios';

export class ConfluenceClient {
  #confluenceClient;
  #spaceKey;
  #rootPageId;

  constructor({ apiUsername, apiPassword, apiBaseUrl, spaceKey, rootPageId }) {
    this.#confluenceClient = axios.create({
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
      params: {
        expand: 'version,children.page.version',
      },
      baseURL: apiBaseUrl,
    });

    this.#spaceKey = spaceKey;
    this.#rootPageId = rootPageId;
  }

  async findOrCreatePageByTitleInParent(title, parentPageId) {
    const { data } = await this.#confluenceClient.get(`/content/${parentPageId}`);

    let confluencePage = data.children.page.results.find((page) => page.title === title);

    if (confluencePage) {
      return confluencePage;
    }

    confluencePage = await this.#confluenceClient.post(`/content`, {
      type: 'page',
      title,
      ancestors: [{ id: parentPageId }],
      space: { key: this.#spaceKey },
      body: { storage: { value: '<p></p>', representation: 'storage' } },
    });

    return this.findOrCreatePageByTitleInParent(title, parentPageId);
  }

  async createConfluencePage(page, confluenceParentPageId) {
    let confluencePage;
    if (!confluenceParentPageId) {
      const { data } = await this.#confluenceClient.get(`/content/${this.#rootPageId}`);
      confluencePage = data;
    } else {
      confluencePage = await this.findOrCreatePageByTitleInParent(page.title, confluenceParentPageId);
    }

    const payload = {
      id: confluencePage.id,
      type: 'page',
      title: page.title,
      body: {
        storage: {
          value: page.body,
          representation: 'storage',
          embeddedContent: [],
        },
      },
      version: { number: confluencePage.version.number + 1 },
    };

    await this.#confluenceClient.put(`/content/${confluencePage.id}`, payload);

    for (const childPage of page.children) {
      await this.createConfluencePage(childPage, confluencePage.id);
    }
  }
}
