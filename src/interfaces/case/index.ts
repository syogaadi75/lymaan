import { CompanyResponse } from "interfaces/company";
import { InsurerData } from "interfaces/insurer";
import { ReportnameResponse } from "interfaces/reportname";
import { VendorData } from "interfaces/vendor";
import * as yup from "yup";

export type StatusesCase =
  | "backlog"
  | "pending"
  | "in progress"
  | "in review"
  | "rejected"
  | "done";

export const bgColorLabelStatus: Record<StatusesCase, string> = {
  backlog: "bg-gray-300",
  pending: "bg-red-500 text-white",
  "in progress": "bg-orange-400 text-white",
  "in review": "bg-blue-500 text-white",
  rejected: "bg-purple-600 text-white",
  done: "bg-green-500 text-white",
};

export const bgColorStatus: Record<StatusesCase, string> = {
  backlog: "bg-gray-300",
  pending: "bg-red-500 text-white",
  "in progress": "bg-orange-400 text-white",
  "in review": "bg-blue-500 text-white",
  rejected: "bg-purple-600 text-white",
  done: "bg-green-600 text-white",
};

export type CompanyType = {
  id: number;
  name: string;
  address: string;
  contact: string;
  person_incharge: string;
  email: string;
  phone: string;
  website: string;
  created_at: string;
};

export type MemberType = {
  id: number;
  share: number;
  name: string;
  address: string;
  email: string;
};

export type AdjusterType = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  created_at: Date;
  roles: string;
};

export type BrokerType = {
  id: number;
  name: string;
  address: string;
  phone: string;
  company: string;
  affiliation: string;
  created_at: string;
};

export type VendorType = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  pic: string;
  website: string;
  created_at: string;
};

export type CaseType = {
  id: number;
  company: CompanyType;
  adjuster: AdjusterType;
  broker: BrokerType;
  vendor: VendorType;
  created_at: string;
  progress: string;
};

export type CaseMainData = {
  company_id: string;
  vendor_id: string;
  adjuster_ids: string[];
  broker_ids: string[];
};

export type RegistrationData = {
  claim_no: string;
  reg_date: Date;
  instruction_date: Date;
  policy_no: string;
  type_of_policy: string;
  certificate_no: string;
  insurence_reff_no: string;
  risk_location: string;
  date_of_loss: string;
  nature_of_loss: string;
  cause: string;
  co_adjuster: string;
  percentage_co_adjuster: string;
  total_sum_insured: string;
  insurance_date: Date;
};

export interface UpdatingData {
  marine_police: string;
  currency: "usd" | "idr";
  reverse: string;
  estimasi_fee: number;
  claim_adjustment: number;
  claim_adjustment_fee: number;
  diskon: number;
  total_invoice: number;
}

export interface CaseResponse
  extends CaseMainData,
  UpdatingData,
  RegistrationData {
  id: string;
  created_at: string;
  updated_at: string;
  company: InsurerData;
  reportnames: ReportnameResponse[];
  adjusters: AdjusterType[];
  brokers: BrokerType[];
  vendor: VendorData;
}

export const CaseSchema = yup
  .object()
  .shape({
    vendor_id: yup.number().required("Insured is a required field!"),
    adjuster_ids: yup.number().required("Insured select role!"),
    company_id: yup
      .array()
      .of(yup.number())
      .required("Insured is a required field!"),
    broker_ids: yup
      .array()
      .of(yup.number())
      .required("Insured is a required field!"),
  })
  .required();

export type CreateCaseType = yup.InferType<typeof CaseSchema>;
export type CreateCaseAssertsShape = yup.Asserts<typeof CaseSchema>;

export type GetAdjustmentFeeType = {
  claim_adjustment: number;
  currency: "idr" | "usd";
  marine: boolean;
};

export type GetAdjustmentFeeResponse = {
  claim_adjustment: string;
  currency: string;
  marine: string;
  claim_adjustment_fee: number;
};

export const RegistrationCaseSchema = yup
  .object()
  .shape({
    claim_no: yup.string().required().label("Claim No"),
    reg_date: yup.string().required().label("Registration Date"),
    instruction_date: yup.string().required().label("Instruction Date"),
    policy_no: yup.string().required().label("Policy No"),
    type_of_policy: yup.string().required().label("Type of Policy"),
    certificate_no: yup.string().required().label("Certificate No"),
    insurence_reff_no: yup.string().required().label("Insurance Reff No"),
    risk_location: yup.string().required().label("Risk Location"),
    date_of_loss: yup.string().required().label("Time, Day And Date Of Loss"),
    nature_of_loss: yup.string().required().label("Nature Of Loss"),
    cause: yup.string().required().label("Cause"),
    co_adjuster: yup.string().nullable().label("Co Adjuster"),
    percentage_co_adjuster: yup
      .string()
      .nullable()
      .label("Precentage Co Adjuster"),
    total_sum_insured: yup.string().required().label("Total Sum Insured"),
    insurance_date: yup.string().nullable(),
  })
  .required();

export const UpdatingCaseSchema = yup
  .object()
  .shape({
    marine_police: yup.string().required().label("Marine Policy"),
    currency: yup.string().required().label("Currency"),
    reverse: yup.string().required().label("Reserve"),
    estimasi_fee: yup.string().required().label("Estimasi Fee"),
    claim_adjustment: yup.string().nullable().label("Claim Adjusment"),
    claim_adjustment_fee: yup.string().nullable(),
    diskon: yup.string().nullable().label("Diskon"),
    total_invoice: yup.string().nullable(),
  })
  .required();
