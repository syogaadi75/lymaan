import {ApiListRequest, ApiListResponse, ReportType} from "interfaces";
import {CoreAPI} from "services/core";

class CommentAPI extends CoreAPI {
  async getListComment(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<any>>("/comment", "GET", {
      params: options,
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async getComment(id: string) {
    const res = await this.fetch("/comment/" + id, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async createComment(json: ReportType) {
    const res = await this.fetch("/comment", "POST", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }

  async updateComment(id: string, json: ReportType) {
    const res = await this.fetch("/comment/" + id, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }

  async deleteComment(id: string) {
    const res = await this.fetch("/comment/" + id, "DELETE", {
      prefix: "la",
      isPrivate: true,
    });

    return res;
  }
}

export default new CommentAPI();
