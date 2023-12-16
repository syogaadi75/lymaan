import {Breadcrumb, Button, Table} from "antd";
import {FaPlus} from "react-icons/fa";
import {TableInstruction} from "./Table";

const ListInstruction = ({
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
            href: "",
          },
          {
            title: "Add Instruction",
            href: "",
          },
        ]}
      />
      <div className="my-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
        <div id="action" className="px-7 py-5">
          <Button
            htmlType="button"
            type="default"
            className="bg-primary-300 text-base text-white font-medium px-3 py-2 flex items-center justify-center"
            onClick={() => setOpenAddInstruction(true)}>
            <FaPlus className="mr-2" />
            <span>Add Instruction</span>
          </Button>
        </div>
        <div id="table">
          <Table
            columns={TableInstruction.columns}
            dataSource={TableInstruction.data}
            scroll={{x: "100%"}}
          />
        </div>
      </div>
    </>
  );
};

export default ListInstruction;
