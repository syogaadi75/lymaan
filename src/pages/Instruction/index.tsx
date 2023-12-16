import {Breadcrumb} from "antd";
import TableInstructions from "./components/TableInstructions";

const InstructionPage = () => {
  return (
    <div>
      <span className="text-2xl font-medium">Instructions</span>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "Instructions",
          },
        ]}
      />
      <TableInstructions />
    </div>
  );
};

export default InstructionPage;
