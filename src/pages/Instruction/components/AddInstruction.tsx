import {Button, Form, Input, Divider, Select} from "antd";
import {Breadcrumb} from "components/ui";

const AddInstruction = ({
  setOpenAddInstruction,
}: {
  setOpenAddInstruction: (val: boolean) => void;
}) => {
  return (
    <>
      <span className="text-2xl font-medium">Instruction</span>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "Instruction",
            href: "/",
          },
          {
            title: "Add Instruction",
            href: "",
          },
        ]}
      />
      <div className="w-full lg:w-1/2 mt-6 mb-24 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
        <div className="pt-5">
          <span className="pl-5 text-xl">Create New Instruction</span>
          <Divider className="pb-4 mb-0 mt-4" />
        </div>
        <Form
          name="basic"
          initialValues={{remember: true}}
          layout="vertical"
          autoComplete="off">
          <div className="w-full pt-2 pl-10 pr-16 mb-16">
            <Form.Item label="Create Date">
              <Input placeholder="May 13, 2023 6:35 AM" />
            </Form.Item>
            <Form.Item label="Assigned To">
              <Select placeholder="Keuangan"></Select>
            </Form.Item>
            <Form.Item label="Company Name">
              <Input placeholder="Enter Company Name" />
            </Form.Item>
            <Form.Item label="Instruction">
              <Input placeholder="Enter instruction" />
            </Form.Item>
            <Form.Item label="Description">
              <Input
                style={{height: "110px"}}
                placeholder="Enter description"
              />
            </Form.Item>
          </div>
          <div className="flex justify-end mr-16 py-10 gap-5">
            <Button
              htmlType="button"
              className="h-12 py-3 px-4 rounded-lg font-medium text-base text-white bg-primary-200"
              onClick={() => setOpenAddInstruction(false)}>
              Cancel
            </Button>
            <Button
              htmlType="submit"
              className="h-12 py-3 px-4 rounded-lg font-medium text-base text-white bg-primary-500">
              Save
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddInstruction;
