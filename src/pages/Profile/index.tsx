import {yupResolver} from "@hookform/resolvers/yup";
import {Card, Typography, message} from "antd";
import {InputField} from "components/hookform";
import {Breadcrumb} from "components/ui";
import Button from "components/ui/buttons/Button";
import {baseUrl} from "constans/config";
import {useUser} from "hooks/atom/useAtom";
import {useUpdateUser} from "hooks/query";
import {useUpload} from "hooks/upload/useUpload";
import {CreateUserData, UpdateUserSchema} from "interfaces";
import jsCookie from "js-cookie";
import {useEffect} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {BiEditAlt} from "react-icons/bi";

const {Title} = Typography;

const ProfilePages = () => {
  const userId = jsCookie.get("user_id") as string;
  const {imageUrl, uploadComponent} = useUpload(
    <Button type="text">
      <BiEditAlt />
    </Button>,
  );

  const {mutate: updateProfile} = useUpdateUser(userId);

  const {user: profileData, refresh} = useUser();

  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    resolver: yupResolver<CreateUserData>(UpdateUserSchema),
  });

  useEffect(() => {
    if (imageUrl) {
      setValue("avatar", imageUrl);
    }
  }, [imageUrl]);

  const onSubmit: SubmitHandler<CreateUserData> = (data) => {
    if (data.password == "") {
      data.password = null;
      data.password_confirmation = null;
    }
    updateProfile(data, {
      onSuccess: () => {
        message.success("Success Update User");
        setValue("password", "");
        setValue("password_confirmation", "");
        refresh();
      },
    });
  };

  useEffect(() => {
    if (profileData) {
      setValue("name", profileData.name);
      setValue("roles", profileData.roles);
      setValue("phone", profileData.phone);
      setValue("email", profileData.email);
      setValue("address", profileData.address);
      setValue("country_code", profileData.country_code);
    }
  }, [profileData]);

  return (
    <div>
      <div className="text-2xl font-medium">Your Profile</div>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "/dashboard",
          },
          {
            title: "Profile",
            href: "#",
          },
        ]}
        className="mt-1"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="on"
        className="mt-6">
        <Card
          title={
            <Title level={4} className="mt-2">
              Basic Info
            </Title>
          }
          bordered={false}
          style={{
            width: "100%",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.06)",
          }}
          className="pl-2">
          <div>
            <div className="flex flex-row mt-6">
              <div>
                <div className="justify-center items-center">
                  <div className="flex justify-end">
                    <div className="absolute">{uploadComponent}</div>
                  </div>
                  <div className="w-52 h-52 overflow-hidden rounded-full ">
                    {profileData && (
                      <img
                        src={
                          imageUrl
                            ? `${baseUrl}/uploads/` + imageUrl
                            : profileData.avatar
                            ? `${baseUrl}/uploads/` + profileData.avatar
                            : `https://ui-avatars.com/api/?name=${profileData.name}`
                        }
                        alt="profile"
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                </div>
                <div className="bg-gray-300 text-center rounded-full mt-5 w-1/2 mx-auto py-1">
                  <p>{profileData?.name}</p>
                </div>
              </div>
              <div className="ml-20 w-72">
                <InputField
                  name="name"
                  label="Full Name"
                  register={register}
                  errors={errors}
                />
                <InputField
                  name="roles"
                  label="Roles"
                  register={register}
                  errors={errors}
                  disabled
                />
                <InputField
                  name="phone"
                  label="Phone"
                  register={register}
                  errors={errors}
                />
                <InputField
                  name="address"
                  label="Address"
                  register={register}
                  errors={errors}
                />
              </div>
              <div className="ml-20 w-80">
                <InputField
                  name="email"
                  label="Email"
                  register={register}
                  errors={errors}
                />
                <InputField
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Leave blank if you dont want to change"
                  register={register}
                  errors={errors}
                />

                <InputField
                  type="password"
                  name="password_confirmation"
                  label="Password Confirm"
                  placeholder="Leave blank if you dont want to change"
                  register={register}
                  errors={errors}
                />
              </div>
            </div>
          </div>
          {/* <div className="mt-12">
            <Divider />
            {<Title level={4}>Delete Account</Title>}
            <Divider />
            <Button htmlType="button" className="px-3">
              Deactive
            </Button>
            <Button
              type="primary"
              htmlType="button"
              danger
              className="px-7 ml-10">
              Delete Account
            </Button>
          </div> */}
          <div className="mt-12 flex justify-end mr-40">
            <Button size="large" htmlType="submit">
              Save
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ProfilePages;
