import {ApiListRequest, ApiListResponse, BrokerEntryDatas} from "interfaces";
import {CoreAPI} from "services/core";

class BrokerAPI extends CoreAPI {
  async getListBroker(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<any>>("/broker", "GET", {
      params: options,
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async getBroker(id: string) {
    const res = await this.fetch("/broker/" + id, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async importBroker(body: FormData) {
    const res = await this.fetch("/import-broker", "POST", {
      prefix: "la",
      isPrivate: true,
      body: body,
    });
    return res;
  }

  async addBroker(json: BrokerEntryDatas) {
    const res = await this.fetch("/broker", "POST", {
      prefix: "la",
      isPrivate: true,
      json: json,
    });

    return res;
  }

  async updateBroker(id: number, json: BrokerEntryDatas) {
    const res = await this.fetch(`/broker/${id}`, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }

  async deleteBroker(id: number) {
    const res = await this.fetch(`/broker/${id}`, "DELETE", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }
}

export default new BrokerAPI();
