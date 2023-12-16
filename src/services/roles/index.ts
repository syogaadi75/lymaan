import {ApiListRequest, ApiListResponse} from "interfaces";
import {CoreAPI} from "services/core";

class RolesAPI extends CoreAPI {
  async getListRoles(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<any>>("/roles", "GET", {
      params: options,
      isPrivate: true,
    });
    return res;
  }

  async getOneRole(id: string) {
    const res = await this.fetch(`/roles/${id}`, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async createRole(json: {name: string; guard_name: string}) {
    const res = await this.fetch("/roles", "POST", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });
    return res;
  }

  async updateRole(id: string, json: {name: string; guard_name: string}) {
    const res = await this.fetch(`/roles/${id}`, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });
    return res;
  }

  async deleteRole(id: string) {
    const res = await this.fetch(`/roles/${id}`, "DELETE", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }
}

export default new RolesAPI();
