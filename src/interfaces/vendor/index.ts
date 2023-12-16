import * as yup from "yup";

export type ImportVendorType = {
  excelFile: File;
};

export type VendorMainData = {
  name: string;
  address: string;
  type_vendor: string;
  phone: string;
  email: string;
  pic: string;
  website: string;
};

export interface VendorData extends VendorMainData {
  id: number;
  created_at: string;
}

export interface VendorTableType extends VendorData {
  key: React.Key;
  actions: React.ReactElement;
}

export interface VendorTableDataUpload extends VendorMainData {
  key: React.Key;
}

export const SubmitInsuredSchema = yup
  .object()
  .shape({
    name: yup.string().required("Insured Name must be filled!"),
    address: yup.string().required("Insured Address must be filled!"),
    type_vendor: yup.string().required("Insured Type must be filled!"),
    phone: yup.string().required("Insured Contact must be filled!"),
    email: yup.string().required("Insured Email Address must be filled!"),
    pic: yup.string().required("Insured Person In Charge must be filled!"),
    website: yup.string().required("Insured website must be filled!"),
  })
  .required();

export type SubmitInsuredType = yup.InferType<typeof SubmitInsuredSchema>;
