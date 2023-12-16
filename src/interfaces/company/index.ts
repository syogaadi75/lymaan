import * as yup from "yup";

export type CompanyData = {
  name: string;
  address: string;
  contact: string;
  person_incharge: string;
  email: string;
  phone: string;
  website: string;
};

export interface CompanyResponse extends CompanyData {
  id: string;
  created_at: string;
  updated_at: string;
}

export const CompanySchema = yup
  .object()
  .shape({
    name: yup.string().required(),
    address: yup.string().required(),
    contact: yup.string().required(),
    person_incharge: yup.string().required(),
    email: yup.string().required(),
    phone: yup.string().required(),
    website: yup.string().required(),
  })
  .required();
