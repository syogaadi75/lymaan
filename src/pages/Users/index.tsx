import {Breadcrumb} from "antd";
import TableUsers from "./components/TableUsers";

const Users = () => {
  return (
    <div>
      <span className="text-2xl font-medium">Users</span>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "User Management",
            href: "/users",
          },
          {
            title: "Users",
          },
        ]}
      />
      <TableUsers />
    </div>
  );
};

export default Users;
