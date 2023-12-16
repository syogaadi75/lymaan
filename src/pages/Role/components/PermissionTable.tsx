import {Form, Checkbox, Button} from "antd";
import type {ColumnsType} from "antd/es/table";
import Table from "antd/es/table";

interface DataType {
  key: React.Key;
  no: number;
  module: string;
  permission: JSX.Element;
}

const columns: ColumnsType<DataType> = [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    render: (_, record, index) => index + 1,
  },
  {
    title: "Module",
    dataIndex: "module",
    key: "module",
  },
  //permission isinya checkbox group
  {
    title: "Permission",
    dataIndex: "permission",
    key: "permission",
  },
];

const data: DataType[] = [
  {
    key: "1",
    no: 1,
    module: "Role",
    permission: (
      <Checkbox.Group
        className="grid grid-cols-4 gap-0"
        options={[
          {label: "Manage", value: "Manage"},
          {label: "Create", value: "Create"},
          {label: "Edit", value: "Edit"},
          {label: "Delete", value: "Delete"},
        ]}
      />
    ),
  },
  {
    key: "2",
    no: 2,
    module: "User",
    permission: (
      <Checkbox.Group
        //jarak antar checkbox 1em
        className="grid grid-cols-4 gap-0"
        options={[
          {label: "Manage", value: "Manage"},
          {label: "Create", value: "Create"},
          {label: "Edit", value: "Edit"},
          {label: "Delete", value: "Delete"},
        ]}></Checkbox.Group>
    ),
  },
  {
    key: "3",
    no: 3,
    module: "Permission",
    permission: (
      <Checkbox.Group
        //jarak antar checkbox 1em
        className="grid grid-cols-4 gap-0"
        options={[
          {label: "Manage", value: "Manage"},
          {label: "Create", value: "Create"},
          {label: "Edit", value: "Edit"},
          {label: "Delete", value: "Delete"},
        ]}></Checkbox.Group>
    ),
  },
  {
    key: "4",
    no: 4,
    module: "Setting",
    permission: (
      <Checkbox.Group
        //jarak antar checkbox 1em
        className="grid grid-cols-4 gap-0"
        options={[{label: "Manage", value: "Manage"}]}></Checkbox.Group>
    ),
  },
  {
    key: "5",
    no: 5,
    module: "Form",
    permission: (
      <Checkbox.Group
        //jarak antar checkbox 1em
        className="grid grid-cols-4 gap-0"
        options={[
          {label: "Manage", value: "Manage"},
          {label: "Create", value: "Create"},
          {label: "Edit", value: "Edit"},
          {label: "Delete", value: "Delete"},
        ]}></Checkbox.Group>
    ),
  },
  {
    key: "6",
    no: 6,
    module: "MailTemplate",
    permission: (
      <Checkbox.Group
        //jarak antar checkbox 1em
        className="grid grid-cols-4 gap-0"
        options={[
          {label: "Manage", value: "Manage"},
          {label: "Create", value: "Create"},
          {label: "Edit", value: "Edit"},
          {label: "Delete", value: "Delete"},
        ]}></Checkbox.Group>
    ),
  },
  {
    key: "7",
    no: 7,
    module: "Submitted Form",
    permission: (
      <Checkbox.Group
        //jarak antar checkbox 1em
        className="grid grid-cols-4 gap-0"
        options={[
          {label: "Manage", value: "Manage"},
          {label: "Create", value: "Create"},
          {label: "Edit", value: "Edit"},
          {label: "Delete", value: "Delete"},
        ]}></Checkbox.Group>
    ),
  },
  {
    key: "8",
    no: 8,
    module: "Language",
    permission: (
      <Checkbox.Group
        //jarak antar checkbox 1em
        className="grid grid-cols-4 gap-0"
        options={[
          {label: "Manage", value: "Manage"},
          {label: "Create", value: "Create"},
        ]}></Checkbox.Group>
    ),
  },
  {
    key: "9",
    no: 9,
    module: "Chat",
    permission: (
      <Checkbox.Group
        //jarak antar checkbox 1em
        className="grid grid-cols-4 gap-0"
        options={[{label: "Manage", value: "Manage"}]}></Checkbox.Group>
    ),
  },
  {
    key: "10",
    no: 10,
    module: "Poll",
    permission: (
      <Checkbox.Group
        //jarak antar checkbox 1em
        className="grid grid-cols-4 gap-0"
        options={[
          {label: "Manage", value: "Manage"},
          {label: "Create", value: "Create"},
          {label: "Edit", value: "Edit"},
          {label: "Delete", value: "Delete"},
        ]}></Checkbox.Group>
    ),
  },
  {
    key: "11",
    no: 11,
    module: "Dashboard Widget",
    permission: (
      <Checkbox.Group
        //jarak antar checkbox 1em
        className="grid grid-cols-4 gap-0"
        options={[
          {label: "Manage", value: "Manage"},
          {label: "Create", value: "Create"},
          {label: "Edit", value: "Edit"},
          {label: "Delete", value: "Delete"},
        ]}></Checkbox.Group>
    ),
  },
  {
    key: "12",
    no: 12,
    module: "Frontend",
    permission: (
      <Checkbox.Group
        //jarak antar checkbox 1em
        className="grid grid-cols-4 gap-0"
        options={[
          {label: "Manage", value: "Manage"},
          {label: "Create", value: "Create"},
          {label: "Edit", value: "Edit"},
          {label: "Delete", value: "Delete"},
        ]}></Checkbox.Group>
    ),
  },
  {
    key: "13",
    no: 13,
    module: "Faqs",
    permission: (
      <Checkbox.Group
        //jarak antar checkbox 1em
        className="grid grid-cols-4 gap-0"
        options={[
          {label: "Manage", value: "Manage"},
          {label: "Create", value: "Create"},
          {label: "Edit", value: "Edit"},
          {label: "Delete", value: "Delete"},
        ]}></Checkbox.Group>
    ),
  },
];

const PermissionTable = ({
  setChangeStatus,
}: {
  setChangeStatus: (val: string) => void;
}) => (
  <Form>
    <Table columns={columns} dataSource={data} pagination={false} />
    <div className="flex justify-end py-5 pr-16 gap-2">
      <Button
        type="text"
        htmlType="button"
        onClick={() => setChangeStatus("0")}
        className="bg-primary-200 text-white">
        Cancel
      </Button>
      <Button
        type="text"
        htmlType="submit"
        className="bg-primary-500 text-white">
        Save
      </Button>
    </div>
  </Form>
);

export default PermissionTable;
