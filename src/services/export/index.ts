import {ExportResponse} from "interfaces";
import {CoreAPI} from "services/core";

class ExportAPI extends CoreAPI {
  async exportInstructionExcel() {
    const res = await this.fetch<ExportResponse>(
      "/export-instruction-excel",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async exportInstructionPDF() {
    const res = await this.fetch<ExportResponse>(
      "/export-instruction-pdf",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async exportSubmitCaseExcel() {
    const res = await this.fetch<ExportResponse>(
      "/export-submitcase-excel",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async exportSubmitCasePDF() {
    const res = await this.fetch<ExportResponse>(
      "/export-submitcase-pdf",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async exportCashAdvanceExcel() {
    const res = await this.fetch<ExportResponse>(
      "/export-cashadvance-excel",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async exportCashAdvancePDF() {
    const res = await this.fetch<ExportResponse>(
      "/export-cashadvance-pdf",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async exportExpensesExcel() {
    const res = await this.fetch<ExportResponse>(
      "/export-expenses-excel",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async exportExpensesPDF() {
    const res = await this.fetch<ExportResponse>(
      "/export-expenses-pdf",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async exportPaymentExcel() {
    const res = await this.fetch<ExportResponse>(
      "/export-payment-excel",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async exportPaymentPDF() {
    const res = await this.fetch<ExportResponse>("/export-payment-pdf", "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async exportBrokerExcel() {
    const res = await this.fetch<ExportResponse>(
      "/export-broker-excel",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async exportBrokerPDF() {
    const res = await this.fetch<ExportResponse>("/export-broker-pdf", "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async exportCompanyPDF() {
    const res = await this.fetch<ExportResponse>("/export-company-pdf", "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }

  async exportCompanyExcel() {
    const res = await this.fetch<ExportResponse>(
      "/export-company-excel",
      "GET",
      {
        prefix: "la",
        isPrivate: true,
      },
    );
    return res;
  }

  async exportVendorExcel() {
    const res = await this.fetch<ExportResponse>(
      "/export-vendor-excel",
      "GET",
      {prefix: "la", isPrivate: true},
    );
    return res;
  }

  async exportVendorPDF() {
    const res = await this.fetch<ExportResponse>("/export-vendor-pdf", "GET", {
      prefix: "la",
      isPrivate: true,
    });
    return res;
  }
}

export default new ExportAPI();
