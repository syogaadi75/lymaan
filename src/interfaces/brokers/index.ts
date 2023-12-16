import * as yup from "yup";

export interface BrokersBasicType {
  name: string;
  company: string;
  address: string;
  created_at: string;
}
export interface BrokersApiType extends BrokersBasicType {
  id: number;
  phone: string;
  affiliation: string;
}

export interface BrokerListsTableType extends BrokersBasicType {
  key: React.Key;
  button_actions: React.ReactElement;
}

export interface UploadBulkBrokersType extends BrokersApiType {
  key: React.Key;
  action: React.ReactNode;
}

export interface ImportBulkBroker {
  brokersInputFile: File;
}

export type BrokerEntryDatas = {
  name: string;
  address: string;
  phone: string;
  company: string;
  affiliation: string;
};

export interface ImportBrokerResponse {
  success: boolean;
  message: string;
}

export const SubmitBrokerSchema = yup
  .object()
  .shape({
    name: yup.string().required().label("Broker Full Name"),
    address: yup.string().required().label("Broker Full Address"),
    phone: yup.string().required().label("Broker Phone Number"),
    company: yup.string().required().label("Broker Phone Insurer"),
    affiliation: yup.string().required().label("Broker Affiliation Source"),
  })
  .required();
