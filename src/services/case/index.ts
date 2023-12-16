import {
  ApiListRequest,
  ApiListResponse,
  CaseResponse,
  CashAdvanceData,
  CreateCaseType,
  ExpensesData,
  GetAdjustmentFeeResponse,
  GetAdjustmentFeeType,
  RegistrationData,
  ReportnameResponse,
  UpdatingData,
} from "interfaces";
import {CoreAPI} from "services/core";

class SubmitCaseAPI extends CoreAPI {
  async getListSubmitCase(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<CaseResponse>>(
      "/submitcase",
      "GET",
      {
        params: options,
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async getSubmitCase(id: string) {
    const res = await this.fetch<CaseResponse>("/submitcase/" + id, "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async createCase(json: CreateCaseType) {
    const res = await this.fetch("/submitcase", "POST", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }

  async updateCase(id: string, json: CreateCaseType) {
    const res = await this.fetch("/submitcase/" + id, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: json,
    });

    return res;
  }

  async deleteCase(id: string) {
    const res = await this.fetch("/submitcase/" + id, "DELETE", {
      prefix: "la",
      isPrivate: true,
    });

    return res;
  }

  async getAdjustmentFee(json: GetAdjustmentFeeType) {
    const res = await this.fetch<GetAdjustmentFeeResponse>(
      "/submitcase/hitungFee",
      "POST",
      {
        prefix: "la",
        isPrivate: true,
        json: {...json},
      },
    );

    return res;
  }

  async registrationCase(id: string, json: RegistrationData) {
    const res = await this.fetch("/submitcase/registration/" + id, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }

  async updatingCase(id: string, json: UpdatingData) {
    const res = await this.fetch("/submitcase/updating/" + id, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: {...json},
    });

    return res;
  }

  async getCashAdvances(id: string) {
    const res = await this.fetch<{data: CashAdvanceData[]}>(
      "/submitcase/" + id + "/cash-advances",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async getExpenses(id: string) {
    const res = await this.fetch<{data: ExpensesData[]}>(
      "/submitcase/" + id + "/expenses",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async getReportNames(id: string) {
    const res = await this.fetch<{data: ReportnameResponse[]}>(
      "/submitcase/" + id + "/report-names",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }
}

export default new SubmitCaseAPI();
