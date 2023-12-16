import * as yup from "yup";

export const AuthSchema = yup
  .object()
  .shape({
    email: yup.string().email().required("Email is a required field!"),
    password: yup.string().required("Password is a required field!"),
  })
  .required();

export type AuthLoginType = yup.InferType<typeof AuthSchema>;
