import {
  ApiListRequest,
  ApiListResponse,
  PaymentData,
  PaymentTypeApi,
} from "interfaces";
import {CoreAPI} from "services/core";

class PaymentAPI extends CoreAPI {
  async getPaymentLists(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<PaymentTypeApi>>(
      "/payment",
      "GET",
      {
        params: options,
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async getPayment(id: number) {
    const res = await this.fetch(`/payment/${id}`, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async createPayment(json: PaymentData) {
    const res = await this.fetch("/payment", "POST", {
      prefix: "la",
      isPrivate: true,
      json: json,
    });

    return res;
  }

  async deletePayment(id: number) {
    const res = await this.fetch(`/payment/${id}`, "DELETE", {
      prefix: "la",
      isPrivate: true,
    });

    return res;
  }

  async updatePayment(id: number, json: PaymentData) {
    const res = await this.fetch(`/payment/${id}`, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }
}

export default new PaymentAPI();
