import {
  NotFoundPage,
  LoginPage,
  DashboardPage,
  ProfilePage,
  UsersPage,
  InstructionPage,
  RolePage,
  SubmittedListPage,
  Payment,
  Statistic,
} from "pages";
import EditUserPage from "pages/Users/edit";
import EditRolePage from "pages/Role/EditRole";
import DetailCasePage from "pages/Submitted/detail";
import ReportPage from "pages/Submitted/report";
import Insurer from "pages/Insurer";
import Adjusters from "pages/Adjusters";
import CashAdvance from "pages/CashAdvance";
import DetailCashAdvance from "pages/CashAdvance/cashadvance";
import DetailExpenses from "pages/CashAdvance/expenses";
import CaseExpenses from "pages/Submitted/expenses";
import ViewPayment from "pages/Payment/view";
import AddUserPage from "pages/Users/add";
import AddCasePage from "pages/Submitted/add";
import AddInstructionPage from "pages/Instruction/add";
import EditInstructionPage from "pages/Instruction/edit";
import EditCasePage from "pages/Submitted/edit";
import Brokers from "pages/Brokers";
import EditPayment from "pages/Payment/edit";
import AddPayment from "pages/Payment/add";
import CompleteCasePage from "pages/Submitted/complete";
import AddInsurer from "pages/Insurer/add";
import EditInsurer from "pages/Insurer/edit";
import ImportInsurer from "pages/Insurer/import";
import UpdateBroker from "pages/Brokers/UpdateBroker";
import ImportBroker from "pages/Brokers/ImportBroker";
import AddBroker from "pages/Brokers/AddBroker";
import Vendor from "pages/Vendor";
import AddVendor from "pages/Vendor/AddVendor";
import UpdateVendor from "pages/Vendor/UpdateVendor";
import ImportVendor from "pages/Vendor/ImportVendor";

const ROUTES = {
  PUBLIC: [
    {
      PATH: "/",
      NAME: "Dashboard",
      COMPONENT: DashboardPage,
    },
    {
      PATH: "/login",
      NAME: "Login",
      COMPONENT: LoginPage,
    },
    {
      PATH: "/payment",
      NAME: "Payment",
      COMPONENT: Payment,
    },
    {
      PATH: "/payment/add",
      NAME: "View Payment",
      COMPONENT: AddPayment,
    },
    {
      PATH: "/payment/:id",
      NAME: "View Payment",
      COMPONENT: ViewPayment,
    },
    {
      PATH: "/payment/:id/edit",
      NAME: "Edit Payment",
      COMPONENT: EditPayment,
    },
    {
      PATH: "/statistic",
      NAME: "Statistic",
      COMPONENT: Statistic,
    },
    {
      PATH: "/profile",
      NAME: "Profile",
      COMPONENT: ProfilePage,
    },
    {
      PATH: "/users",
      NAME: "Users",
      COMPONENT: UsersPage,
    },
    {
      PATH: "/users/add",
      NAME: "Add Users",
      COMPONENT: AddUserPage,
    },
    {
      PATH: "/users/:id/edit",
      NAME: "Edit User",
      COMPONENT: EditUserPage,
    },
    {
      PATH: "/insurer",
      NAME: "Insurer",
      COMPONENT: Insurer,
    },
    {
      PATH: "/insurer/add",
      NAME: "Add Insurer",
      COMPONENT: AddInsurer,
    },
    {
      PATH: "/insurer/edit/:id",
      NAME: "Edit Insurer",
      COMPONENT: EditInsurer,
    },
    {
      PATH: "/insurer/import",
      NAME: "Import Insurer",
      COMPONENT: ImportInsurer,
    },
    {
      PATH: "/insured",
      NAME: "Insured Lists",
      COMPONENT: Vendor,
      EXACT: true,
    },
    {
      PATH: "/insured/import",
      NAME: "Import Insured",
      COMPONENT: ImportVendor,
    },
    {
      PATH: "/insured/add",
      NAME: "Add Insured",
      COMPONENT: AddVendor,
    },
    {
      PATH: "/insured/edit/:id",
      NAME: "Update Insured",
      COMPONENT: UpdateVendor,
    },
    // {
    //   PATH: "/adjusters",
    //   NAME: "Adjusters",
    //   COMPONENT: Adjusters,
    // },
    {
      PATH: "/brokers",
      NAME: "Brokers",
      COMPONENT: Brokers,
      EXACT: true,
    },
    {
      PATH: "/brokers/import",
      NAME: "Import Brokers",
      COMPONENT: ImportBroker,
      EXACT: false,
    },
    {
      PATH: "/broker/edit/:id",
      NAME: "Update Broker",
      COMPONENT: UpdateBroker,
      EXACT: false,
    },
    {
      PATH: "/broker/add",
      NAME: "Add Broker",
      COMPONENT: AddBroker,
      EXACT: false,
    },
    {
      PATH: "/broker/edit/:id",
      NAME: "Update Broker",
      COMPONENT: UpdateBroker,
      EXACT: false,
    },
    {
      PATH: "/instruction",
      NAME: "Instruction",
      COMPONENT: InstructionPage,
    },
    {
      PATH: "/instruction/add",
      NAME: "Instruction",
      COMPONENT: AddInstructionPage,
    },
    {
      PATH: "/instruction/:id/edit",
      NAME: "Instruction",
      COMPONENT: EditInstructionPage,
    },
    {
      PATH: "/roles",
      NAME: "Roles",
      COMPONENT: RolePage,
    },
    {
      PATH: "/roles/edit-role/:id",
      NAME: "Edit Role",
      COMPONENT: EditRolePage,
    },
    {
      PATH: "/submitted-case",
      NAME: "Submitted Case",
      COMPONENT: SubmittedListPage,
    },
    {
      PATH: "/complete-case",
      NAME: "complete Case",
      COMPONENT: CompleteCasePage,
    },
    {
      PATH: "/submitted-case/add",
      NAME: "Create Submitted Case",
      COMPONENT: AddCasePage,
    },
    {
      PATH: "/complete-case",
      NAME: "complete Case",
      COMPONENT: CompleteCasePage,
    },
    {
      PATH: "/submitted-case/:id",
      NAME: "Detail Submitted Case",
      COMPONENT: DetailCasePage,
    },
    {
      PATH: "/submitted-case/:id/edit",
      NAME: "Edit Submitted Case",
      COMPONENT: EditCasePage,
    },
    {
      PATH: "/submitted-case/:id/report/:report_id",
      NAME: "Detail Submitted Case",
      COMPONENT: ReportPage,
    },
    {
      PATH: "/submitted-case/:id/expenses",
      NAME: "Detail Submitted Case",
      COMPONENT: CaseExpenses,
    },
    {
      PATH: "/cash-advance/cash/:id",
      NAME: "Cash Advance",
      COMPONENT: DetailCashAdvance,
    },
    {
      PATH: "/cash-advance/expenses/:id",
      NAME: "Expenses",
      COMPONENT: DetailExpenses,
    },
    {
      PATH: "/cash-advance",
      NAME: "Cash Advance",
      COMPONENT: CashAdvance,
    },
    {
      PATH: "*",
      NAME: "NotFound",
      COMPONENT: NotFoundPage,
    },
  ],
};

export default ROUTES;
