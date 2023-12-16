import {yupResolver} from "@hookform/resolvers/yup";
import {Card, Typography, Button} from "antd";
import {InputField} from "components/hookform";
import {Breadcrumb} from "components/ui";
import {useGetOneRoles, useUpdateRole} from "hooks/query";
import {RoleSchema, RoleType} from "interfaces";
import NotFoundPage from "pages/NotFound";
import {useEffect} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {useHistory, useParams} from "react-router";

const {Title} = Typography;

const EditRolePage = () => {
  const {push} = useHistory();
  const {id} = useParams<{id: string}>();
  const {
    data: role,
    isLoading: isLoadingRole,
    isRefetching,
  } = useGetOneRoles(id);
  const {mutate: updateRole, isLoading} = useUpdateRole(id);
  const {register, handleSubmit, setError, setValue, formState} = useForm({
    resolver: yupResolver(RoleSchema),
  });

  const onSubmit: SubmitHandler<RoleType> = ({roleName}) => {
    const updatedRole = {
      name: roleName,
      guard_name: roleName,
    };

    updateRole(updatedRole, {
      onSuccess: (data) => {
        if (data.success) push("/roles");
      },
      onError: () => {
        setError("roleName", {
          type: "errorResponse",
          message: "Something went wrong!. Please try again.",
        });
      },
    });
  };

  useEffect(() => {
    if (role?.data) setValue("roleName", role.data.name);
  }, [role]);

  if (isLoadingRole || isRefetching) return null;

  if (role?.data === null) {
    return <NotFoundPage />;
  }

  return (
    <div>
      <div className="text-2xl font-medium">Edit Role</div>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "User Management",
            href: "/role",
          },
          {
            title: "Roles",
            href: "/role",
          },
          {
            title: "Add Roles",
          },
        ]}
        className="mt-1"
      />
      <Card
        title={
          <Title level={3} className="mt-2">
            Update Role
          </Title>
        }
        bordered={false}
        style={{
          width: 634,
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.06)",
        }}
        className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            type="text"
            placeholder="Enter role name"
            name="roleName"
            label="Role Name"
            isRequired
            register={register}
            errors={formState.errors}
            labelclassName="font-medium text-sm"
          />
          <div className="flex justify-end gap-5 mt-10">
            <Button
              type="text"
              htmlType="button"
              onClick={() => push("/roles")}
              className="bg-primary-200 p-4 h-fit text-white font-medium">
              Cancel
            </Button>
            <Button
              type="text"
              htmlType="submit"
              disabled={isLoading}
              loading={isLoading}
              className="bg-primary-500 p-4 h-fit text-white font-medium">
              {isLoading ? "Loading" : "Update"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditRolePage;
