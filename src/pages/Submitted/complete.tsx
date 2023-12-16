import {Breadcrumb} from "components/ui";
import TableCases from "./components/TableCases";

const CompleteCasePage = () => {
  return (
    <div>
      <div className="text-2xl font-medium">Complete Case</div>
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
            title: "Complete Case",
          },
        ]}
      />
      <TableCases isComplete />
    </div>
  );
};

export default CompleteCasePage;
