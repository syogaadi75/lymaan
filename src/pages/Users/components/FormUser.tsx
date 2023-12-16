import {yupResolver} from "@hookform/resolvers/yup";
import {Divider, message} from "antd";
import {InputField} from "components/hookform";
import {useCreateUser, useGetListRoles, useUpdateUser} from "hooks/query";
import {SubmitHandler, useForm} from "react-hook-form";
import {
  CreateUserData,
  UserResponse,
  CreateUserSchema,
  UpdateUserSchema,
  defaultApiListOptions,
} from "interfaces";
import {Breadcrumb} from "components/ui";
import {useHistory} from "react-router-dom";
import {useEffect} from "react";
import Button from "components/ui/buttons/Button";
// import UploadUserAvatar from "./UploadUserAvatar";

type FormUserProps = {
  user?: UserResponse;
};

const FormUser = ({user}: FormUserProps) => {
  const {push} = useHistory();

  const {mutate: createUser, isLoading} = useCreateUser();
  const {mutate: updateUser, isLoading: isLoadingUpdate} = useUpdateUser(
    user ? user.id.toString() : "0",
  );
  const {data: roles} = useGetListRoles(defaultApiListOptions);
  const {register, handleSubmit, formState, setError, setValue} = useForm({
    resolver: yupResolver<CreateUserData>(
      user ? UpdateUserSchema : CreateUserSchema,
    ),
    defaultValues: {
      ...user,
      avatar: "",
      signature: "profile.jpg",
    },
  });

  const onSubmit: SubmitHandler<CreateUserData> = (data) => {
    if (user) {
      if (data.password == "") {
        data.password = null;
        data.password_confirmation = null;
      }
      updateUser(data, {
        onSuccess: () => {
          message.success("Success Update User");
          push("/users");
        },
        onError: (data) => {
          alert(JSON.stringify(data));
        },
      });
    } else {
      createUser(data, {
        onSuccess: (data) => {
          if (data.success) {
            message.success("Success Create User");
            push("/users");
          } else {
            data.data.map(({key, value}: {key: any; value: any}) => {
              setError(key, value[0]);
            });

            alert(JSON.stringify(data));
          }
        },
        onError: (data) => {
          alert(JSON.stringify(data));
        },
      });
    }
  };

  useEffect(() => {
    if (user) {
      setValue("active_status", user.active_status);
      setValue("address", user.address);
      setValue("avatar", user.avatar);
      setValue("country_code", user.country_code);
      setValue("email", user.email);
      setValue("name", user.name);
      setValue("phone", user.phone);
      setValue("roles", user.roles);
      setValue("signature", user.signature);
    }
  }, [user]);

  return (
    <>
      <span className="text-2xl font-medium">{user ? "Edit" : "Add"} User</span>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "#",
          },
          {
            title: "User Management",
            href: "/users",
          },
          {
            title: "Users",
            href: "/users",
          },
          {
            title: (user ? "Edit" : "Add") + " User",
          },
        ]}
      />
      <div className="w-full lg:w-1/2 mt-6 mb-24 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
        <div className="pt-5">
          <span className="pl-5 text-xl">{user ? "Edit" : "Add"} User</span>
          <Divider className="pb-4 mb-0 mt-4" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-6 pb-6 flex flex-col gap-3">
          <div className="flex flex-col">
            <InputField
              type="text"
              placeholder="Enter name"
              name="name"
              label="Name"
              isRequired
              register={register}
              errors={formState.errors}
              labelclassName="font-medium text-sm"
            />
            <InputField
              type="email"
              placeholder="Enter email address"
              name="email"
              label="Email"
              isRequired
              register={register}
              errors={formState.errors}
              labelclassName="font-medium text-sm"
            />
            <InputField
              type="password"
              placeholder={
                !user
                  ? "Enter password"
                  : "Leave blank if you dont want to change"
              }
              name="password"
              label="Password"
              isRequired={!user}
              register={register}
              errors={formState.errors}
              labelclassName="font-medium text-sm"
            />
            <InputField
              type="password"
              placeholder={
                !user
                  ? "Enter confirm password"
                  : "Leave blank if you dont want to change"
              }
              name="password_confirmation"
              label="Confirm Password"
              isRequired={!user}
              register={register}
              errors={formState.errors}
              labelclassName="font-medium text-sm"
            />
            <fieldset className="flex flex-col space-y-1 mb-2">
              <label className="font-medium text-sm">
                Country Code <span className="text-red-500"> &#42; </span>
              </label>
              <select
                className="border border-solid border-[#d6d6d6] rounded-md py-2 px-2 transition-colors hover:border-[#40a9ff] focus:outline-[#40a9ff] focus:border-[#40a9ff] focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]"
                {...register("country_code")}
                defaultValue="+62">
                <option value="+62">+62</option>
              </select>
              <p className="mt-1 text-left text-[12px] text-red-500 opacity-80">
                {formState.errors?.country_code?.message}
              </p>
            </fieldset>
            <InputField
              type="tel"
              placeholder="Enter phone number"
              name="phone"
              label="Phone Number"
              isRequired
              register={register}
              errors={formState.errors}
              labelclassName="font-medium text-sm"
            />
            <InputField
              placeholder="Enter Address"
              name="address"
              label="Address"
              isRequired
              register={register}
              errors={formState.errors}
              labelclassName="font-medium text-sm"
            />

            <fieldset className="flex flex-col space-y-1 mb-2">
              <label className="font-medium text-sm">
                Role <span className="text-red-500"> &#42; </span>
              </label>
              <select
                className="border border-solid border-[#d6d6d6] rounded-md py-2 px-2 transition-colors hover:border-[#40a9ff] focus:outline-[#40a9ff] focus:border-[#40a9ff] focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]"
                {...register("roles")}>
                <option value="" disabled>
                  Select role
                </option>
                {roles?.data?.map(
                  (role: {
                    id: number;
                    name: string;
                    guard_name: string;
                    created_at: string;
                    updated_at: string;
                  }) => {
                    return (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    );
                  },
                )}
              </select>
              <p className="mt-1 text-left text-[12px] text-red-500 opacity-80">
                {formState.errors?.roles?.message}
              </p>
            </fieldset>
          </div>
          {/* <div className="pt-5">
            <span className="pl-5 text-xl">Add Signature</span>
            <Divider className="pb-4 mb-0 mt-4" />
          </div>
          <UploadUserAvatar containerClassName="ml-5" withButton={true} /> */}
          <div className="flex justify-end gap-5">
            <Button
              color="secondary"
              size="large"
              onClick={() => push("/users")}>
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="ghost"
              size="large"
              disabled={isLoading || isLoadingUpdate}
              loading={isLoading || isLoadingUpdate}>
              {isLoading ? "Loading" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormUser;
