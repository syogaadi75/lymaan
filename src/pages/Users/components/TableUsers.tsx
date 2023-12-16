import {ReactComponent as ActiveUserIcon} from "public/icons/user-check-01.svg";
import {ReactComponent as DeactiveUserIcon} from "public/icons/user-x-01.svg";
import {ReactComponent as EditUserIcon} from "public/icons/edit-05.svg";
import {ReactComponent as DeleteUserIcon} from "public/icons/trash-01.svg";
import {useDeleteUser, useGetListUsers, useUpdateUser} from "hooks/query";
import {useHistory} from "react-router";
import {
  ApiListRequest,
  UserResponse,
  UserType,
  defaultApiListOptions,
} from "interfaces";
import {useQueryClient} from "react-query";
import {ColumnsType} from "antd/es/table";
import Table, {
  MainColumnsType,
  paginationFromResponse,
} from "components/ui/Table";
import {useState} from "react";
import {Modal} from "components/ui";
import {capitalizeFirstLetter} from "utils";
import {useDisclosure} from "hooks";
import IconButton from "components/ui/buttons/IconButton";

export interface UserColumnsType extends MainColumnsType, UserResponse {
  status: string;
  action: React.ReactElement;
}

export const columns: ColumnsType<UserColumnsType> = [
  {
    title: "No",
    dataIndex: "no",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: {
      compare: (a, b) => a.name.localeCompare(b.name),
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: {
      compare: (a, b) => a.email.localeCompare(b.email),
    },
  },
  {
    title: "Role",
    dataIndex: "roles",
    sorter: {
      compare: (a, b) => a.roles.localeCompare(b.roles),
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    sorter: {
      compare: (a, b) => a.status.localeCompare(b.status),
    },
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

export const ActionButtons = ({
  isUserActive = true,
  user,
  onOpen,
  setDeleteModalContent,
}: {
  isUserActive?: boolean;
  user: UserType;
  onOpen: () => void;
  setDeleteModalContent: (val: UserType) => void;
}) => {
  const {push} = useHistory();
  const {mutate: updateUser} = useUpdateUser(user.id);
  const queryClient = useQueryClient();

  const handleSetActiveStatus = () => {
    let {active_status} = user;
    active_status = active_status === "1" ? "0" : "1";
    updateUser(
      {...user, active_status},
      {
        onSuccess: () => {
          queryClient.invalidateQueries("get-users");
        },
      },
    );
  };

  const handleOpenDeleteModal = () => {
    setDeleteModalContent(user);
    onOpen();
  };

  return (
    <div className="flex gap-2">
      <IconButton
        tooltip={"Click to " + (isUserActive ? "Deactive" : "Active")}
        color={!isUserActive ? "danger" : "primary"}
        onClick={handleSetActiveStatus}>
        {isUserActive ? <ActiveUserIcon /> : <DeactiveUserIcon />}
      </IconButton>
      <IconButton tooltip="Edit" onClick={() => push(`/users/${user.id}/edit`)}>
        <EditUserIcon />
      </IconButton>
      <IconButton tooltip="Delete" onClick={handleOpenDeleteModal}>
        <DeleteUserIcon />
      </IconButton>
    </div>
  );
};

const TableUsers = () => {
  const [deleteModalContent, setDeleteModalContent] = useState<UserType>({});
  const {isOpen, onClose, onOpen} = useDisclosure();
  const {mutate: deleteUser, isLoading} = useDeleteUser(deleteModalContent?.id);
  const {push} = useHistory();
  const queryClient = useQueryClient();

  const handleDeleteUser = () => {
    deleteUser(deleteModalContent?.id, {
      onSuccess: () => {
        queryClient.invalidateQueries("get-users");
        onClose();
      },
    });
  };

  const [listOption, setListOption] = useState<ApiListRequest>(
    defaultApiListOptions,
  );

  const {data, isLoading: isLoadingGet, refetch} = useGetListUsers(listOption);

  const dataSource: UserColumnsType[] =
    data?.data?.map(
      (data, index): UserColumnsType => ({
        ...data,
        status: data.active_status === "1" ? "Active" : "Deactive",
        key: data.id,
        no: (listOption.page - 1) * listOption.per_page + (index + 1),
        action: (
          <ActionButtons
            isUserActive={data.active_status === "1" ? true : false}
            user={data}
            onOpen={onOpen}
            setDeleteModalContent={setDeleteModalContent}
          />
        ),
      }),
    ) ?? [];
  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isLoadingGet}
        pagination={paginationFromResponse(data)}
        onChangePagination={(page, pageSize) =>
          setListOption({
            page: page,
            per_page: pageSize,
            search: listOption.search,
          })
        }
        onAddButton={() => push("/users/add")}
        onPrintButton={() => push("/users/add")}
        onExportButton={() => push("/users/add")}
        onReloadButton={refetch}
        onChangeSearch={(value) =>
          setListOption({
            page: 1,
            search: value,
            per_page: listOption.per_page,
          })
        }
        title="User"
      />
      <Modal
        isOpen={isOpen}
        onClose={() => onClose()}
        title="Delete User"
        okText="Delete"
        okType="danger"
        okButtonProps={{onClick: handleDeleteUser, loading: isLoading}}>
        <div className="flex flex-col gap-2 pb-3">
          <p>Are you sure you want to delete this user? :</p>
          <div>
            <label className="ml-2 font-semibold">Name</label>
            <p className="border border-black rounded-md px-2 py-1">
              {deleteModalContent.name}
            </p>
          </div>
          <div>
            <label className="ml-2 font-semibold">Email</label>
            <p className="border border-black rounded-md px-2 py-1">
              {deleteModalContent.email}
            </p>
          </div>
          <div>
            <label className="ml-2 font-semibold">Role</label>
            <p className="border border-black rounded-md px-2 py-1">
              {deleteModalContent.roles &&
                capitalizeFirstLetter(deleteModalContent.roles)}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TableUsers;
