import {
  ApiListRequest,
  ApiListResponse,
  InstructionData,
  InstructionResponse,
} from "interfaces";
import {CoreAPI} from "services/core";

class InstructionAPI extends CoreAPI {
  async getListInstructions(options: ApiListRequest) {
    const res = await this.fetch<ApiListResponse<InstructionResponse>>(
      "/instruction",
      "GET",
      {
        params: options,
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async getOneInstruction(id: string) {
    const res = await this.fetch<{instruction: InstructionResponse}>(
      `/instruction/${id}`,
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async createInstructions(json: InstructionData) {
    const res = await this.fetch("/instruction", "POST", {
      prefix: "la",
      isPrivate: true,
      json: json,
    });
    return res;
  }

  async updateInstruction(id: string, json: InstructionData) {
    const res = await this.fetch(`/instruction/${id}`, "PUT", {
      prefix: "la",
      isPrivate: true,
      json: json,
    });
    return res;
  }

  async deleteInstruction(id: string) {
    const res = await this.fetch(`/instruction/${id}`, "DELETE", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }
}

export default new InstructionAPI();
