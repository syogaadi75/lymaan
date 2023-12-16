import * as yup from "yup";

export type UserData = {
  name: string;
  email: string;
  roles: string;
  phone: string;
  active_status: string;
  address: string;
  country_code: string;
  avatar: string | null;
  signature: string | null;
};

export interface CreateUserData extends UserData {
  password: string | null;
  password_confirmation: string | null;
}

export interface UserResponse extends UserData {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export const CreateUserSchema = yup
  .object()
  .shape({
    name: yup.string().required().label("Name"),
    email: yup.string().email().required().label("Email"),
    password: yup.string().required().label("Password"),
    password_confirmation: yup
      .string()
      .required()
      .oneOf(
        [yup.ref("password"), null],
        "Confirmation password doesnt match!",
      ),
    country_code: yup.string().required().label("Country Code"),
    phone: yup.string().length(12).required().label("Phone"),
    address: yup.string().required().label("Address"),
    roles: yup.string().required().label("Role"),
  })
  .required();

export const UpdateUserSchema = yup
  .object()
  .shape({
    name: yup.string().required().label("Name"),
    email: yup.string().email().required().label("Email"),
    country_code: yup.string().required().label("Country Code"),
    password: yup.string().nullable().label("Password"),
    password_confirmation: yup
      .string()
      .nullable()
      .oneOf(
        [yup.ref("password"), null],
        "Confirmation password doesnt match!",
      ),
    phone: yup.string().length(12).required().label("Phone"),
    address: yup.string().required().label("Address"),
    roles: yup.string().required().label("Role"),
  })
  .required();

export type UserType = yup.InferType<typeof CreateUserSchema>;
export type UpdateUserType = yup.InferType<typeof UpdateUserSchema>;
