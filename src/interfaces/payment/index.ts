import {CompanyResponse} from "interfaces/company";
import * as yup from "yup";

export type PaymentData = {
  inv_date: string;
  due_date: string;
  case_id: number;
  company_id: number;
  client_reference: string;
  ref_date: string;
  add_information: string;
  amount_due: number;
  expenses: number;
  currency: string;
  subtotal: number;
  stamp_duty: number;
  tax_percentage: number;
  tax_base: number;
  wht: number | null;
  total_amount_due: number;
  your_share: number;
  status: string;
};

export type PaymentTypeApi = {
  id: number;
  inv_date: string;
  due_date: string;
  case_id: string;
  company_id: string;
  insured_name: string;
  insured_address: string;
  client_reference: string;
  ref_date: string;
  add_information: string;
  amount_due: number;
  expenses: number;
  currency: string;
  subtotal: number;
  stamp_duty: number;
  tax_base: number;
  tax_percentage: number;
  wht: number;
  total_amount_due: number;
  status: string;
  your_share: number;
  company: CompanyResponse;
};

export type AddPaymentFormType = {
  id: number;
  payment_status: string;
  case_id: string;
  inv_number: string;
  inv_date: string;
  due_date: string;
  company_id: string;
  insurer_address: string;
  client_reference: string;
  ref_date: string;
  add_information: string;
  currency: string | undefined;
  claim_adjustment: string | number | undefined;
  claim_adjustment_fee: number;
  portion_100_percent: string | number;
  share: number;
  amount_due: number;
  expenses_portion: number | undefined;
  expenses: number;
  tax_percentage: number;
  your_share: number;
  tax_base: number;
  subtotal: number;
  wht: number;
  stamp_duty: number;
  total_amount_due: number;
};

export type EditPaymentFormType = {
  payment_status: "Proforma" | "Invoice" | "Done";
  inv_date: string;
  due_date: string;
  ref_date: string;
  case_id: number;
  company_id: number;
  insurer_address: string;
  add_information: string;
  client_reference: string;
  claim_adjustment: string;
  claim_adjustment_fee: string;
  currency: "idr" | "usd";
  your_share: number;
  expenses: number;
  subtotal: number;
  wht: number;
  tax_base: number;
  total_amount_due: number;
};

export const AddPaymentSchema = yup
  .object()
  .shape({
    payment_status: yup.string().required("Payment status must be selected"),
    company_id: yup
      .number()
      .notOneOf([0], "Please select one of insurer naame")
      .required("Insurer name is required"),
    case_id: yup
      .number()
      .notOneOf([0], "Please select one of case number!")
      .required("Case number is required!"),
    inv_number: yup.string().required("Invoice number must be filled!"),
    inv_date: yup.date().required("Invoice date must filled!"),
    due_date: yup.date().required("Invoice due date must filled!"),
    portion_100_percent: yup
      .number()
      .notOneOf([0], "Portion share value must be above 0")
      .required("Portion share % must be filled!"),
    claim_adjustment: yup
      .number()
      .notOneOf([0], "Claim adjustment value must be above 0")
      .required("Claim adjustment must be filled!"),
    claim_adjustment_fee: yup
      .number()
      .notOneOf([0], "Fee value must be above 0")
      .required("Claim adjustment fee must be filled!"),
    insurer_address: yup.string().required("Insurer address must be filled"),
    ref_date: yup.date(),
    client_reference: yup.string().nullable(),
    add_information: yup.string().nullable(),
    currency: yup.string().required("Currency must be selected"),
    amount_due: yup
      .string()
      .notOneOf(["0"], "Amount due value must be above 0")
      .required("Amount due must be filled!"),
    expenses: yup.number().required("Expenses must be filled!"),
    tax_percentage: yup.number().required("Tax Percentage is required"),
    tax_base: yup.number().required("Tax base is required"),
    subtotal: yup.number().required("Subtotal must be filled!"),
    wht: yup.number().required("WHT is required"),
    stamp_duty: yup.number().required("Stamp duty must be filled!"),
    total_amount_due: yup
      .string()
      .notOneOf(["0"], "total amount due must be above 0")
      .required("Total amount must be filled!"),
  })
  .required();

export const UpdatePaymentSchema = yup
  .object()
  .shape({
    inv_date: yup.string().required().label("Invoice Date"),
    due_date: yup.string().required().label("Due Date"),
    case_id: yup
      .number()
      .notOneOf([0], "Select one of case number above")
      .required()
      .label("Case Number"),
    company_id: yup
      .number()
      .notOneOf([0], "Select one of case number above")
      .required()
      .label("Due Date"),
    ref_date: yup.string().required().label("Client Reference"),
    client_ref: yup.string().nullable(),
    add_information: yup.string().nullable(),
    your_share: yup.number().required().label("Your Share"),
    amount_due: yup.number().required().label("Amount Due"),
    currency: yup.string().required().label("Currency"),
    expenses: yup.number().required().label("Amount Due"),
    tax_percentage: yup.number().required("Tax Percentage is required"),
    subtotal: yup.number().required("Subtotal must be filled!"),
    wht: yup.number().required("WHT is required"),
    stamp_duty: yup.number().required("Stamp duty must be filled!"),
    total_amount_due: yup
      .string()
      .notOneOf(["0"], "total amount due must be above 0")
      .required("Total amount must be filled!"),
  })
  .required();

export type AddPaymentType = yup.InferType<typeof AddPaymentSchema>;
export type UpdatePaymentType = yup.InferType<typeof UpdatePaymentSchema>;
