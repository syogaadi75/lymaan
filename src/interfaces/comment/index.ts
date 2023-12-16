import * as yup from "yup";

export type CommentMainData = {
  user_id: string;
  text: string;
  report_id: string;
  parent_id: string | null;
};

export interface CommentData extends CommentMainData {
  id: string;
  created_at: string;
  updated_at: string;
}

export const CommentSchema = yup
  .object()
  .shape({
    user_id: yup.string().required(),
    text: yup.string().required(),
    report_id: yup.string().required(),
    parent_id: yup.string().nullable(),
  })
  .required();
