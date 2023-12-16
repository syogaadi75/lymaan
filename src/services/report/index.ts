import {ApiListRequest, ApiListResponse, ReportType} from "interfaces";
import {CoreAPI} from "services/core";

class ReportAPI extends CoreAPI {
  async getListReport(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<any>>("/report", "GET", {
      params: options,
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async getReport(id: string) {
    const res = await this.fetch("/report/" + id, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async createReport(json: ReportType) {
    const res = await this.fetch("/report", "POST", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }

  async updateReport(id: string, json: ReportType) {
    const res = await this.fetch("/report/" + id, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }

  async deleteReport(id: string) {
    const res = await this.fetch("/report/" + id, "DELETE", {
      prefix: "la",
      isPrivate: true,
    });

    return res;
  }
}

export default new ReportAPI();
