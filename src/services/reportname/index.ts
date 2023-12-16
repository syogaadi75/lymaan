import {ApiListRequest, ApiListResponse, ReportnameType} from "interfaces";
import {CoreAPI} from "services/core";

class ReportnameAPI extends CoreAPI {
  async getListReportname(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<any>>("/reportname", "GET", {
      params: options,
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async getReportName(id: string) {
    const res = await this.fetch("/reportname/" + id, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async createReportname(json: ReportnameType) {
    const res = await this.fetch("/reportname", "POST", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }

  async updateReportname(id: string, json: ReportnameType) {
    const res = await this.fetch("/reportname/" + id, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }

  async deleteReportname(id: string) {
    const res = await this.fetch("/reportname/" + id, "DELETE", {
      prefix: "la",
      isPrivate: true,
    });

    return res;
  }

  async approveReport(id: string) {
    const res = await this.fetch("/reportname/" + id + "/approve", "POST", {
      prefix: "la",
      isPrivate: true,
    });

    return res;
  }

  async rejectReport(id: string) {
    const res = await this.fetch("/reportname/" + id + "/reject", "POST", {
      prefix: "la",
      isPrivate: true,
    });

    return res;
  }
}

export default new ReportnameAPI();
