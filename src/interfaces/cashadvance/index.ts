import * as yup from "yup";

export type CashAdvanceMainData = {
  case_id: number;
  type: string;
  description: string;
  nominal: string;
  signature: string;
  is_case: boolean;
};

export interface CashAdvanceData extends CashAdvanceMainData {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  roles: string;
}

export const CashAdvanceSchema = yup
  .object()
  .shape({
    case_id: yup.number().required().label("Case"),
    type: yup.string().required().label("Type"),
    description: yup.string().required().label("Description"),
    nominal: yup.string().required().label("Nominal"),
    signature: yup.string().required().label("Signature"),
  })
  .required();

export type CashAdavanceType = yup.InferType<typeof CashAdvanceSchema>;
export type CashAdavanceAssertsShape = yup.Asserts<typeof CashAdvanceSchema>;
