import {ApiListRequest, ApiListResponse, UserResponse} from "interfaces";
import {CoreAPI} from "services/core";

class AdjusterAPI extends CoreAPI {
  async getListAdjuster(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<UserResponse>>(
      "/users?search=adjuster",
      "GET",
      {
        // params: options,
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async getAdjuster(id: string) {
    const res = await this.fetch("/users/" + id, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }
}

export default new AdjusterAPI();
