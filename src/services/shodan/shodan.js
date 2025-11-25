import shodan from "shodan-client";

class HTTPError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

class Shodan {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.searchOpts = { minify: true };
  }

  async search(query, opts = {}) {
    try {
      return await shodan.search(query, this.apiKey, {
        ...this.searchOpts,
        ...opts,
      });
    } catch (err) {
      console.error("Shodan search error:", err);
      throw new HTTPError(500, "Erro ao consultar Shodan (search)");
    }
  }

  async searchTokens(query, opts) {
    try {
      return await shodan.searchTokens(query, this.apiKey, opts);
    } catch (err) {
      console.error("Shodan search error:", err);
      throw new HTTPError(500, "Erro ao consultar Shodan (search)");
    }
  }

  async host(ip) {
    try {
      return await shodan.host(ip, this.apiKey);
    } catch (err) {
      console.error("Shodan host error:", err);
      throw new HTTPError(500, "Erro ao consultar Shodan (host)");
    }
  }

  async count(query) {
    try {
      return await shodan.count(query, this.apiKey);
    } catch (err) {
      console.error("Shodan count error:", err);
      throw new HTTPError(500, "Erro ao consultar Shodan (count)");
    }
  }

  async searchDatabases(target) {
    const query = `product:mysql,redis,mongodb,mariadb,postgresql,influxdb,ms-sql hostname:${target}`;
    return this.search(query, { facets: "product:5" });
  }

  async searchScreenshots(target) {
    const query = `has_screenshot:true hostname:${target}`;
    return this.search(query);
  }

  async searchSMB(target) {
    const query = `has_screenshot:true hostname:${target}`;
    return this.search(query);
  }
}

export default Shodan;