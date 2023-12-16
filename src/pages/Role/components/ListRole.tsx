import {TableRoles} from "./ListTable";
import {Breadcrumb, Modal} from "components/ui";
import {useState} from "react";
import {useDisclosure} from "hooks";
import {RoleTypeAPI} from "interfaces";
import {useDeleteRole} from "hooks/query";
import {useQueryClient} from "react-query";

const ListRole = () => {
  const queryClient = useQueryClient();
  const [deleteModalContent, setDeleteModalContent] = useState<RoleTypeAPI>({});
  const {isOpen, onClose, onOpen} = useDisclosure();

  const {mutate: deleteRole, isLoading} = useDeleteRole(
    deleteModalContent?.id as string,
  );

  const handleDeleteRole = () => {
    deleteRole(deleteModalContent?.id, {
      onSuccess: () => {
        queryClient.invalidateQueries("get-roles");
        onClose();
      },
    });
  };

  return (
    <div>
      <div>
        <div className="text-2xl font-medium">Roles</div>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: "Dashboard",
              href: "/",
            },
            {
              title: "User Management",
              href: "",
            },
            {
              title: "Roles",
            },
          ]}
          className="mt-1"
        />
        <div id="table" className="my-6 flex gap-8 min-w-inherit">
          <div
            id="table_role"
            className="bg-white flex flex-col basis-full rounded-lg 
          shadow-[0_0_30px_rgba(0,0,0,0.1)] overflow-hidden">
            <TableRoles
              onOpen={onOpen}
              setDeleteModalContent={setDeleteModalContent}
            />
          </div>
        </div>
        <Modal
          isOpen={isOpen}
          onClose={() => onClose()}
          title="Delete Role"
          okText="Delete"
          okType="danger"
          okButtonProps={{
            onClick: handleDeleteRole,
            loading: isLoading,
          }}>
          <div className="flex flex-col gap-2 pb-3">
            <p>Are you sure you want to delete this role? :</p>
            <div>
              <label className="ml-2 font-semibold">Role Name</label>
              <p className="border border-black rounded-md px-2 py-1">
                {deleteModalContent?.name}
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ListRole;
