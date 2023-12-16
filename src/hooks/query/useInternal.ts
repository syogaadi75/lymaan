import {
  ApiListRequest,
  CashAdvanceData,
  ExpensesData,
  ReportnameResponse,
} from "interfaces";
import {useQuery} from "react-query";
import {
  adjusterAPI,
  brokerAPI,
  cashAdvanceAPI,
  companyAPI,
  expensesAPI,
  instructionAPI,
  notificationAPI,
  paymentAPI,
  reportAPI,
  reportnameAPI,
  rolesApi,
  submitCaseAPI,
  userAPI,
  vendorAPI,
} from "services";

export const useGetListUsers = (options: ApiListRequest) => {
  return useQuery(["get-users", options], () => userAPI.getListUsers(options));
};

export const useGetOneUser = (id: string) => {
  return useQuery(["get-user"], () => userAPI.getOneUser(id));
};

export const useGetListRoles = (options: ApiListRequest) => {
  return useQuery(["get-roles", options], () => rolesApi.getListRoles(options));
};

export const useGetOneRoles = (id: string) => {
  return useQuery(["get-role"], () => rolesApi.getOneRole(id));
};

export const useGetListInstructions = (options: ApiListRequest) => {
  return useQuery(["get-instructions", options], () =>
    instructionAPI.getListInstructions(options),
  );
};

export const useGetOneInstructions = (id: string) => {
  return useQuery(["get-instruction"], () =>
    instructionAPI.getOneInstruction(id),
  );
};

export const useGetListSubmitCase = (options: ApiListRequest) => {
  return useQuery(["get-list-submitted-case", options], () =>
    submitCaseAPI.getListSubmitCase(options),
  );
};

export const useGetSubmitCase = (id: string) => {
  return useQuery(["get-submitted-case"], () =>
    submitCaseAPI.getSubmitCase(id),
  );
};

export const useGetCaseCashAdvances = (
  id: string,
  onSuccess?: (data: {data: CashAdvanceData[]}) => void,
) => {
  return useQuery(
    ["get-list-case-cash-advances"],
    () => submitCaseAPI.getCashAdvances(id),
    {
      onSuccess,
    },
  );
};

export const useGetCaseExpenses = (
  id: string,
  onSuccess?: (data: {data: ExpensesData[]}) => void,
) => {
  return useQuery(
    ["get-list-case-cash-expenses"],
    () => submitCaseAPI.getExpenses(id),
    {
      onSuccess,
    },
  );
};

export const useGetCaseReportNames = (
  id: string,
  onSuccess?: (data: ReportnameResponse[]) => void,
) => {
  return useQuery(
    ["get-list-report-name"],
    () => submitCaseAPI.getReportNames(id),
    {
      onSuccess: (data) => {
        if (onSuccess) onSuccess(data.data);
      },
    },
  );
};

export const useGetListCompany = (options: ApiListRequest) => {
  return useQuery(["get-list-company", options], () =>
    companyAPI.getListCompany(options),
  );
};

export const useGetCompany = (id: string) => {
  return useQuery(["get-company"], () => companyAPI.getCompany(id));
};

export const useGetListAdjuster = (options: ApiListRequest) => {
  return useQuery(["get-list-adjuster", options], () =>
    adjusterAPI.getListAdjuster(options),
  );
};

export const useGetListBroker = (options: ApiListRequest) => {
  return useQuery(["get-list-broker", options], () =>
    brokerAPI.getListBroker(options),
  );
};

export const useGetBroker = (id: string) => {
  return useQuery(["get-broker"], () => brokerAPI.getBroker(id));
};

export const useGetListVendor = (options: ApiListRequest) => {
  return useQuery(["get-list-vendor", options], () =>
    vendorAPI.getListVendor(options),
  );
};

export const useGetVendor = (id: string) => {
  return useQuery(["get-vendor"], () => {
    return vendorAPI.getVendor(id);
  });
};

export const useGetListReportname = (options: ApiListRequest) => {
  return useQuery(["get-list-reportname", options], () =>
    reportnameAPI.getListReportname(options),
  );
};

export const useGetReportname = (
  id: string,
  onSuccess?: (data: {status: string; data: ReportnameResponse}) => void,
) => {
  return useQuery(["get-report-name"], () => reportnameAPI.getReportName(id), {
    onSuccess: onSuccess,
  });
};

export const useGetListReport = (options: ApiListRequest) => {
  return useQuery(["get-list-report", options], () =>
    reportAPI.getListReport(options),
  );
};

export const useGetReport = (id: string) => {
  return useQuery(["get-report"], () => reportAPI.getReport(id));
};

export const useGetListCashAdvance = (options: ApiListRequest) => {
  return useQuery(["get-list-cashadvance", options], () =>
    cashAdvanceAPI.getListCashAdvance(options),
  );
};

export const useGetListExpenses = (options: ApiListRequest) => {
  return useQuery(["get-list-expenses", options], () =>
    expensesAPI.getListExpenses(options),
  );
};

export const useGetListPayments = (options: ApiListRequest) => {
  return useQuery(["get-list-payments", options], () =>
    paymentAPI.getPaymentLists(options),
  );
};

export const useGetPayment = (id: number) => {
  return useQuery(["get-payment", id], () => paymentAPI.getPayment(id));
};

export const useGetNotification = () => {
  return useQuery(["get-notification"], () =>
    notificationAPI.getListNotification(),
  );
};
