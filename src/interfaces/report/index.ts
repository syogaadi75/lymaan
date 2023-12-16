import {CommentData} from "interfaces/comment";
import {Reportname} from "interfaces/reportname";
import * as yup from "yup";

export type ReportMainData = {
  title: string;
  description: string;
  report_name_id: string;
};

export interface ReportData extends ReportMainData {
  id: string | null;
  created_at: string | null;
  updated_at: string | null;
  comments?: CommentData[] | null;
}

export const ReportSchema = yup
  .object()
  .shape({
    report_name_id: yup.string().required("Reportname is a required field!"),
    title: yup.string().required("Title is a required field!"),
    description: yup.string().required("Description is a required field!"),
  })
  .required();

export type ReportType = yup.InferType<typeof ReportSchema>;

export interface Report extends ReportType {
  id: number;
  report_name: Reportname;
  updated_at: Date;
}
