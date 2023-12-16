import PermissionTable from "./PermissionTable";
import {Breadcrumb} from "components/ui";

const PermissionRole = ({
  setChangeStatus,
}: {
  setChangeStatus: (val: string) => void;
}) => {
  return (
    <div>
      <div className="text-2xl font-medium">Permission</div>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "User Management",
            href: "/roles",
          },
          {
            title: "Roles",
            href: "/roles",
          },
          {
            title: "Admin",
            href: "/roles",
          },
          {
            title: "Permission",
          },
        ]}
        className="mt-1"
      />
      <div id="table" className="my-6 flex gap-8">
        <div
          id="table_permission"
          className="bg-white flex flex-col basis-full rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="mx-6 my-4 flex justify-between">
            <span className="text-lg">All Permission</span>
          </div>
          <PermissionTable setChangeStatus={setChangeStatus} />
        </div>
      </div>
    </div>
  );
};

export default PermissionRole;
