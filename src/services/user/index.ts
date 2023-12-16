import {
  ApiListRequest,
  ApiListResponse,
  UserResponse,
  UserType,
} from "interfaces";
import {CoreAPI} from "services/core";

class UserAPI extends CoreAPI {
  async getListUsers(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<UserResponse>>(
      "/users",
      "GET",
      {
        params: options,
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async getOneUser(id: string) {
    const res = await this.fetch<{data: UserResponse}>(`/users/${id}`, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async createUsers(json: UserType) {
    const res = await this.fetch("create-user", "POST", {
      prefix: "",
      isPrivate: true,
      json: {...json},
    });
    return res;
  }

  async updateUser(id: string, json: UserType) {
    const res = await this.fetch(`/users/${id}`, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });
    return res;
  }

  async deleteUser(id: string) {
    const res = await this.fetch(`/users/${id}`, "DELETE", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }
}

export default new UserAPI();
