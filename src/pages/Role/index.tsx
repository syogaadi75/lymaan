import {Button} from "antd";
import ListRole from "./components/ListRole";
import AddRole from "./components/AddRole";
import Permission from "./components/Permission";
import {useState} from "react";
const Role = () => {
  const [changeStatus, setChangeStatus] = useState("0");

  const renderStatus = () => {
    if (changeStatus === "1")
      return <AddRole setChangeStatus={setChangeStatus} />;
    else if (changeStatus === "2")
      return <Permission setChangeStatus={setChangeStatus} />;

    return <ListRole />;
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          className="px-12 bg-slate-500 text-white"
          onClick={() => setChangeStatus("1")}>
          Add Role
        </Button>
        <Button
          className="px-12 bg-slate-500 text-white"
          onClick={() => setChangeStatus("2")}>
          Permission
        </Button>
      </div>
      {renderStatus()}
    </>
  );
};

export default Role;
