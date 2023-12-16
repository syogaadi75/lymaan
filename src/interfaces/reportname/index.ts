import {ReportData} from "interfaces/report";
import * as yup from "yup";

export type ReportnameData = {
  report_name: string;
  status: string;
  case_id: string;
};
export interface ReportnameResponse extends ReportnameData {
  id: string;
  created_at: string;
  updated_at: string;
  report_table?: ReportData[];
  approve_tenaga_ahli_id: number;
  approve_tenaga_ahli_date: Date;
  approve_direktur_id: number;
  approve_direktur_date: Date;
  approve_sekretaris_id: number;
  approve_sekretaris_date: Date;
  reject_tenaga_ahli_id: number;
  reject_tenaga_ahli_date: Date;
  reject_direktur_id: number;
  reject_direktur_date: Date;
  reject_sekretaris_id: number;
  reject_sekretaris_date: Date;
}

export const ReportnameSchema = yup
  .object()
  .shape({
    case_id: yup.string().required("Case is a required field!"),
    report_name: yup.string().required("Report Name is a required field!"),
    status: yup.string().required("Status is a required field!"),
  })
  .required();

export type ReportnameType = yup.InferType<typeof ReportnameSchema>;

export interface Reportname extends ReportnameType {
  id: number;
  updated_at: Date;
}
