import {message} from "antd";
import {
  CreateCaseType,
  UpdateUserType,
  UserType,
  ReportnameType,
  CompanyData,
  CommentMainData,
  ReportMainData,
  CashAdvanceMainData,
  ExpensesMainData,
  PaymentData,
  GetAdjustmentFeeType,
  GetAdjustmentFeeResponse,
  UpdatingData,
  UpdatePaymentType,
  ImportBulkBroker,
  BrokerEntryDatas,
  SubmitInsurerType,
  VendorMainData,
  RegistrationData,
} from "interfaces";
import {useMutation, useQueryClient} from "react-query";

import {
  reportAPI,
  reportnameAPI,
  submitCaseAPI,
  rolesApi,
  userAPI,
  companyAPI,
  commentAPI,
  cashAdvanceAPI,
  expensesAPI,
  paymentAPI,
  instructionAPI,
  brokerAPI,
  exportAPI,
  vendorAPI,
  notificationAPI,
} from "services";

export const useCreateUser = () => {
  return useMutation((json: UserType) => {
    return userAPI.createUsers({...json});
  });
};

export const useUpdateUser = (id: string) => {
  return useMutation((json: UpdateUserType) => {
    return userAPI.updateUser(id, {...json});
  });
};

export const useDeleteUser = (id: string) => {
  return useMutation(() => {
    return userAPI.deleteUser(id);
  });
};

export const useCreateRole = () => {
  return useMutation((json: {name: string; guard_name: string}) => {
    return rolesApi.createRole({...json});
  });
};

export const useUpdateRole = (id: string) => {
  return useMutation((json: {name: string; guard_name: string}) => {
    return rolesApi.updateRole(id, {...json});
  });
};

export const useDeleteRole = (id: string) => {
  return useMutation(() => {
    return rolesApi.deleteRole(id);
  });
};

export const useCreateInstruction = () => {
  return useMutation((json: UserType) => {
    return instructionAPI.createInstructions({...json});
  });
};

export const useUpdateInstruction = (id: string) => {
  return useMutation((json: UpdateUserType) => {
    return instructionAPI.updateInstruction(id, {...json});
  });
};

export const useDeleteInstruction = () => {
  return useMutation((id: string) => {
    return instructionAPI.deleteInstruction(id);
  });
};

export const useCreateCase = () => {
  return useMutation((json: CreateCaseType) => {
    return submitCaseAPI.createCase({...json});
  });
};

export const useUpdateCase = (id: string) => {
  return useMutation((json: CreateCaseType) => {
    return submitCaseAPI.updateCase(id, json);
  });
};

export const useDeleteCase = () => {
  return useMutation((id: string) => {
    return submitCaseAPI.deleteCase(id);
  });
};

export const useGetAdjusterFee = (
  onSuccess: (data: GetAdjustmentFeeResponse) => void,
) => {
  return useMutation(
    (json: GetAdjustmentFeeType) => {
      return submitCaseAPI.getAdjustmentFee(json);
    },
    {
      onSuccess: onSuccess,
    },
  );
};

export const useRegistrationCase = (id: string) => {
  return useMutation((json: RegistrationData) => {
    return submitCaseAPI.registrationCase(id, json);
  });
};

export const useUpdatingCase = (id: string) => {
  return useMutation((json: UpdatingData) => {
    return submitCaseAPI.updatingCase(id, json);
  });
};

export const useCreateReportname = () => {
  return useMutation((json: ReportnameType) => {
    const result = reportnameAPI.createReportname({...json});
    result.then((res) => {
      reportAPI.createReport({
        title: json.report_name,
        description: json.report_name,
        report_name_id: res.data.id,
      });
    });
    return result;
  });
};

export const useDeleteReportname = () => {
  return useMutation((id: string) => {
    return reportnameAPI.deleteReportname(id);
  });
};

export const useApproveReport = (onSuccess: () => void) => {
  return useMutation((id: string) => reportnameAPI.approveReport(id), {
    onSuccess: () => {
      message.success("Berhasil Approve Report");
      onSuccess();
    },
  });
};

export const useRejectReport = (onSuccess: () => void) =>
  useMutation((id: string) => reportnameAPI.rejectReport(id), {
    onSuccess: () => {
      message.success("Berhasil Reject Report");
      onSuccess();
    },
  });

export const useCreateReport = (json: ReportMainData) => {
  return reportAPI.createReport({...json});
};

export const useUpdateReport = (id: string, json: ReportMainData) => {
  return reportAPI.updateReport(id, {...json});
};

export const useDeleteReport = (id: string) => {
  return reportAPI.deleteReport(id);
};

export const useCreateComment = () => {
  return useMutation((json: CommentMainData) => {
    return commentAPI.createComment({...json});
  });
};

export const useCreateCashAdvance = () => {
  return useMutation((json: CashAdvanceMainData) => {
    return cashAdvanceAPI.createCashAdvance({...json});
  });
};

export const useCreateExpenses = () => {
  return useMutation((json: ExpensesMainData) => {
    return expensesAPI.createExpenses({...json});
  });
};

export const useCreatePayment = () => {
  return useMutation((json: PaymentData) => {
    return paymentAPI.createPayment(json);
  });
};

export const useUpdatePayment = (id: number) => {
  return useMutation((json: UpdatePaymentType) => {
    return paymentAPI.updatePayment(id, {...json});
  });
};

export const useDeletePayment = () => {
  return useMutation((id: number) => {
    return paymentAPI.deletePayment(id);
  });
};

// Start Broker Todo

export const useAddBroker = () => {
  return useMutation((json: BrokerEntryDatas) => {
    return brokerAPI.addBroker(json);
  });
};

export const useUpdateBroker = (id: number) => {
  return useMutation((json: BrokerEntryDatas) => {
    return brokerAPI.updateBroker(id, {...json});
  });
};

export const useImportBroker = () => {
  return useMutation((file: File) => {
    const body = new FormData();
    body.append("file", file);
    return brokerAPI.importBroker(body);
  });
};

export const useDeleteBroker = () => {
  return useMutation((id: number) => {
    return brokerAPI.deleteBroker(id);
  });
};

// End Broker Todo

// START company Todos

export const useImportCompany = () => {
  return useMutation((file: File) => {
    const body = new FormData();
    body.append("file", file);
    return companyAPI.importCompany(body);
  });
};

export const useAddCompany = () => {
  return useMutation((json: SubmitInsurerType) => {
    return companyAPI.addCompany(json);
  });
};

export const useUpdateCompany = (id: number) => {
  return useMutation((json: SubmitInsurerType) => {
    return companyAPI.updateCompany(id, {...json});
  });
};

export const useDeleteCompany = () => {
  return useMutation((id: number) => {
    return companyAPI.deleteCompany(id);
  });
};

// END company todos

// START vendor todo

export const useImportVendor = () => {
  return useMutation((file: File) => {
    const body = new FormData();
    body.append("file", file);
    return vendorAPI.importVendor(body);
  });
};

export const useAddVendor = () => {
  return useMutation((json: VendorMainData) => {
    return vendorAPI.addVendor(json);
  });
};

export const useUpdateVendor = (id: number) => {
  return useMutation((json: VendorMainData) => {
    return vendorAPI.updateVendor(id, {...json});
  });
};

export const useDeleteVendor = () => {
  return useMutation((id: number) => {
    return vendorAPI.deleteInsurer(id);
  });
};

// END vendor todo

// EXPORT

export const useExportBrokerExcel = () => {
  return useMutation(() => exportAPI.exportBrokerExcel(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportBrokerPDF = () => {
  return useMutation(() => exportAPI.exportBrokerPDF(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportInstructionExcel = () => {
  return useMutation(() => exportAPI.exportInstructionExcel(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportInstructionPDF = () => {
  return useMutation(() => exportAPI.exportInstructionPDF(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportSubmitCaseExcel = () => {
  return useMutation(() => exportAPI.exportSubmitCaseExcel(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportSubmitCasePDF = () => {
  return useMutation(() => exportAPI.exportSubmitCasePDF(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportCashAdvanceExcel = () => {
  return useMutation(() => exportAPI.exportCashAdvanceExcel(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportCashAdvancePDF = () => {
  return useMutation(() => exportAPI.exportCashAdvancePDF(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportExpensesExcel = () => {
  return useMutation(() => exportAPI.exportExpensesExcel(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportExpensesPDF = () => {
  return useMutation(() => exportAPI.exportExpensesPDF(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportPaymentExcel = () => {
  return useMutation(() => exportAPI.exportPaymentExcel(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportPaymentPDF = () => {
  return useMutation(() => exportAPI.exportPaymentPDF(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportCompanyPDF = () => {
  return useMutation(() => exportAPI.exportCompanyPDF(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useSeenNotification = (onSuccess?: () => void) => {
  return useMutation((id: number) => notificationAPI.seenNotification(id), {
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
};

export const useExportCompanyExcel = () => {
  return useMutation(() => exportAPI.exportCompanyExcel(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportVendorExcel = () => {
  return useMutation(() => exportAPI.exportVendorExcel(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useExportVendorPDF = () => {
  return useMutation(() => exportAPI.exportVendorPDF(), {
    onSuccess: (data) => {
      window.open(data.file_url, "_blank");
    },
  });
};

export const useSeenAllNotification = (onSuccess?: () => void) => {
  return useMutation(() => notificationAPI.seenAllNotification(), {
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });
};
