import {
  ApiListRequest,
  ApiListResponse,
  CashAdavanceType,
  ExpensesData,
} from "interfaces";
import {CoreAPI} from "services/core";

class ExpensesAPI extends CoreAPI {
  async getListExpenses(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<ExpensesData>>(
      "/expenses",
      "GET",
      {
        params: options,
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async getExpenses(id: string) {
    const res = await this.fetch("/expenses/" + id, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async createExpenses(json: CashAdavanceType) {
    const res = await this.fetch("/expenses", "POST", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }
}

export default new ExpensesAPI();
