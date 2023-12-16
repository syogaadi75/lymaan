import {
  VendorData,
  VendorMainData,
  ApiListRequest,
  ApiListResponse,
} from "interfaces";
import {CoreAPI} from "services/core";

class VendorAPI extends CoreAPI {
  async getListVendor(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<VendorData>>(
      "/vendor",
      "GET",
      {
        params: options,
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async getVendor(id: string) {
    const res = await this.fetch(`/vendor/${id}`, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async importVendor(body: FormData) {
    const res = await this.fetch("/import-vendor", "POST", {
      prefix: "la",
      isPrivate: true,
      body: body,
    });
    return res;
  }

  async addVendor(json: VendorMainData) {
    const res = await this.fetch("/vendor", "POST", {
      prefix: "la",
      isPrivate: true,
      json: json,
    });
    return res;
  }

  async updateVendor(id: number, json: VendorMainData) {
    const res = await this.fetch(`/vendor/${id}`, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });
    return res;
  }

  async deleteInsurer(id: number) {
    const res = await this.fetch(`/vendor/${id}`, "DELETE", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }
}

export default new VendorAPI();
