import type {ColumnsType} from "antd/es/table";
import {Button, Table, PaginationProps} from "antd";
import {ReactComponent as CheckDoneIcon} from "public/icons/check-done-02.svg";
import {ReactComponent as EditUserIcon} from "public/icons/edit-05.svg";
import {ReactComponent as DeleteUserIcon} from "public/icons/trash-01.svg";
import {useGetListRoles} from "hooks/query";
import {useHistory} from "react-router";
import {RoleTypeAPI, defaultApiListOptions} from "interfaces";

interface DataTypeRoles {
  key: React.Key;
  no: number;
  name: string;
  createdAt: string;
  action: React.ReactElement;
}

const itemRender: PaginationProps["itemRender"] = (
  _,
  type,
  originalElement,
) => {
  if (type === "prev") {
    return <a>Previous</a>;
  }
  if (type === "next") {
    return <a>Next</a>;
  }
  return originalElement;
};

const ActionsButtons = ({
  role,
  onOpen,
  setDeleteModalContent,
}: {
  role: RoleTypeAPI;
  onOpen: () => void;
  setDeleteModalContent: (val: RoleTypeAPI) => void;
}) => {
  const {push} = useHistory();

  const handleOpenDeleteModal = () => {
    setDeleteModalContent(role);
    onOpen();
  };

  return (
    <div className="flex gap-2">
      <Button
        htmlType="button"
        type="default"
        className="rounded-lg p-[6px] w-9 h-9 bg-primary-100">
        <CheckDoneIcon />
      </Button>
      <Button
        htmlType="button"
        type="default"
        onClick={() => push(`/roles/edit-role/${role.id}`)}
        className="bg-primary-100 w-9 h-9 rounded-lg p-[6px]">
        <EditUserIcon />
      </Button>
      <Button
        htmlType="button"
        type="default"
        onClick={handleOpenDeleteModal}
        className="bg-primary-100 w-9 h-9 rounded-lg p-[6px]">
        <DeleteUserIcon />
      </Button>
    </div>
  );
};

export const TableRoles = ({
  onOpen,
  setDeleteModalContent,
}: {
  onOpen: () => void;
  setDeleteModalContent: (val: RoleTypeAPI) => void;
}) => {
  const {data, isLoading} = useGetListRoles(defaultApiListOptions);

  const columns: ColumnsType<DataTypeRoles> = [
    {title: "No", dataIndex: "no", render: (_, record, index) => index + 1},
    {
      title: "Name",
      dataIndex: "name",
      sorter: {compare: (a, b) => a.name.localeCompare(b.name)},
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      sorter: {
        compare: (a, b) =>
          new Date(a.createdAt)
            .toString()
            .localeCompare(new Date(b.createdAt).toString()),
      },
    },
    {title: "Action", dataIndex: "action"},
  ];
  const dataSource: DataTypeRoles[] = (data?.data ?? []).map(
    (role: RoleTypeAPI, index: number) => {
      return {
        key: role.id,
        no: index,
        name: role.name,
        createdAt: new Date(role.created_at)
          .toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
          .replace(" at", ""),
        action: (
          <ActionsButtons
            role={role}
            onOpen={onOpen}
            setDeleteModalContent={setDeleteModalContent}
          />
        ),
      };
    },
  );

  return (
    <Table
      columns={columns}
      dataSource={isLoading ? [] : dataSource}
      pagination={{
        position: ["bottomCenter"],
        defaultPageSize: 10,
        showSizeChanger: true,
        itemRender: itemRender,
        pageSizeOptions: ["10", "20", "30", "40", "50"],
      }}
      scroll={{x: "100%"}}
      rowClassName="[&>*:nth-child(4)]:capitalize"
      loading={isLoading}
    />
  );
};
