import {
  ApiListRequest,
  ApiListResponse,
  CashAdavanceType,
  CashAdvanceData,
} from "interfaces";
import {CoreAPI} from "services/core";

class CashAdvanceAPI extends CoreAPI {
  async getListCashAdvance(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<CashAdvanceData>>(
      "/cashadvance",
      "GET",
      {
        params: options,
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async getCashAdvance(id: string) {
    const res = await this.fetch("/cashadvance/" + id, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async createCashAdvance(json: CashAdavanceType) {
    const res = await this.fetch("/cashadvance", "POST", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }
}

export default new CashAdvanceAPI();
