import {Breadcrumb} from "components/ui";
import TableCases from "./components/TableCases";

const CasePage = () => {
  return (
    <div>
      <div className="text-2xl font-medium">Submitted Case</div>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "Case",
            href: "",
          },
          {
            title: "Submitted Case",
          },
        ]}
      />
      <TableCases />
    </div>
  );
};

export default CasePage;
