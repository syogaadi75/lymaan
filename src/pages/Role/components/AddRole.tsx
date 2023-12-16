import {yupResolver} from "@hookform/resolvers/yup";
import {Breadcrumb, Card, Typography, Button} from "antd";
import {InputField} from "components/hookform";
import {useCreateRole} from "hooks/query";
import {RoleSchema, RoleType} from "interfaces";
import {SubmitHandler, useForm} from "react-hook-form";

const {Title} = Typography;

const AddRole = ({
  setChangeStatus,
}: {
  setChangeStatus: (val: string) => void;
}) => {
  const {mutate: createRole, isLoading} = useCreateRole();

  const {register, handleSubmit, setError, formState} = useForm({
    resolver: yupResolver(RoleSchema),
  });

  const onSubmit: SubmitHandler<RoleType> = (submittedData) => {
    const newRole = {
      name: submittedData.roleName,
      guard_name: submittedData.roleName,
    };
    createRole(newRole, {
      onSuccess: (data) => {
        if (data.success) setChangeStatus("0");
      },
      onError: () => {
        setError("roleName", {
          type: "errorResponse",
          message: "Something went wrong!. Please try again.",
        });
      },
    });
  };

  return (
    <div>
      <div className="text-2xl font-medium">Add Role</div>
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
            Create Role
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
              onClick={() => setChangeStatus("0")}
              className="bg-primary-200 p-4 h-fit text-white font-medium">
              Cancel
            </Button>
            <Button
              type="text"
              htmlType="submit"
              disabled={isLoading}
              loading={isLoading}
              className="bg-primary-500 p-4 h-fit text-white font-medium">
              {isLoading ? "Loading" : "Save"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddRole;
