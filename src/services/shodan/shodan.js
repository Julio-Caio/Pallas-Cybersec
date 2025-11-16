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

  async host(ip) {
    try {
      const hostInfo = await shodan.host(this.apiKey, ip);
      return hostInfo;
    } catch (error) {
      throw new HTTPError(500, "Error getting host info from Shodan");
    }
  }

  async search(query) {
    try {
      const results = await shodan.search(query, this.apiKey, this.searchOpts);
      return results;
    } catch (error) {
      console.error("Shodan error:", error);
      throw new HTTPError(500, "Error searching Shodan");
    }
  }

  async host(ip) {
    try {
      const info = await shodan.host(ip);
      return info;
    } catch (error) {
      console.error("Shodan host error:", error);
      throw new HTTPError(500, "Error getting host info from Shodan");
    }
  }

  async count(query) {
    try {
      const count = await shodan.count(query);
      return count;
    } catch (error) {
      console.error("Shodan count error:", error);
      throw new HTTPError(500, "Error counting Shodan results");
    }
  }

  async facets(query, facets) {
    try {
      const facetResults = await shodan.search(query, facets);
      return facetResults;
    } catch (error) {
      throw new HTTPError(500, "Error getting facets from Shodan");
    }
  }

  async searchDatabases(target) {
    try {
      const databases = await shodan.search(`product:database hostname:${target}`, this.apiKey);
      return databases;
      
    } catch (error) {
      throw new HTTPError(500, "Error searching databases from Shodan");
    }
  }

  async searchScreenshots(target) {
    try {
      const screenshots = await shodan.search(`has_screenshot:true hostname:${target}`, this.apiKey);
      return screenshots;
      
    } catch (error) {
      throw new HTTPError(500, "Error searching screenshots from Shodan");
    }
  }

  async getHostInfo(ip) {
    try {
      const hostInfo = await shodan.host(this.apiKey, ip);
      return hostInfo;
    } catch (error) {
      throw new HTTPError(500, "Error getting host info from Shodan");
    }
  }

  async count(query) {
    try {
      const countResult = await shodan.count(this.apiKey, query);
      return countResult;
    } catch (error) {
      throw new HTTPError(500, "Error counting Shodan results");
    }
  }
}

export default Shodan;