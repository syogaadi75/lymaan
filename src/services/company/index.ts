import {
  InsurerMainData,
  ApiListRequest,
  ApiListResponse,
  InsurerData,
} from "interfaces";
import {CoreAPI} from "services/core";

class CompanyAPI extends CoreAPI {
  async getListCompany(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<InsurerData>>(
      "/company",
      "GET",
      {
        params: options,
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async getCompany(id: string) {
    const res = await this.fetch("/company/" + id, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async importCompany(body: FormData) {
    const res = await this.fetch("/import-company", "POST", {
      prefix: "la",
      isPrivate: true,
      body: body,
    });
    return res;
  }

  async addCompany(json: InsurerMainData) {
    const res = await this.fetch("/company", "POST", {
      prefix: "la",
      isPrivate: true,
      json: json,
    });
    return res;
  }

  async updateCompany(id: number, json: InsurerMainData) {
    const res = await this.fetch(`/company/${id}`, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });
    return res;
  }

  async deleteCompany(id: number) {
    const res = await this.fetch(`/company/${id}`, "DELETE", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }
}

export default new CompanyAPI();
