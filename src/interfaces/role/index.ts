import * as yup from "yup";

export const RoleSchema = yup
  .object()
  .shape({
    roleName: yup.string().required("Role name is a required field!"),
  })
  .required();

const RoleSchemaAPI = yup
  .object()
  .shape({
    id: yup.string().required(),
    name: yup.string().required(),
    guard_name: yup.string().required(),
    created_at: yup.string().required(),
    updated_at: yup.string().required(),
  })
  .required();

export type RoleType = yup.InferType<typeof RoleSchema>;
export type RoleTypeAPI = yup.InferType<typeof RoleSchemaAPI>;
