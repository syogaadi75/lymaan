import * as yup from "yup";

export type ImportInsurerTemplate = {
  excelFile: File;
};

export type InsurerMainData = {
  name: string;
  address: string;
  contact: string;
  phone: string;
  email: string;
  person_incharge: string;
  website: string;
};

export interface InsurerData extends InsurerMainData {
  id: number;
  created_at: string;
  share: number;
}

export interface InsurerDataResponse<T> extends InsurerData {
  data: T;
}

export const SubmitInsurerSchema = yup
  .object()
  .shape({
    name: yup.string().required().label("Insurer Name"),
    address: yup.string().required().label("Insurer Address"),
    contact: yup.string().required().label("Insurer Contact"),
    phone: yup.string().required().label("Insurer Phone"),
    email: yup.string().required().label("Insurer Email Address"),
    person_incharge: yup.string().required().label("Insurer Person in Charge"),
    website: yup.string().required().label("Insurer Website"),
  })
  .required();

export type SubmitInsurerType = yup.InferType<typeof SubmitInsurerSchema>;
