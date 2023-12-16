import TableCashAdvance from "./components/TableCashAdvance";
import {useDisclosure} from "hooks";
import AddCashDialog from "./components/AddCashDialog";
import {Breadcrumb} from "components/ui";

function CashAdvance() {
  const {isOpen, onClose} = useDisclosure();

  return (
    <div>
      <div className="text-2xl font-medium">Cash Advance</div>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "Cash Advance",
          },
        ]}
      />
      <TableCashAdvance />
      {/* ADD CASH ADVANCE */}
      <AddCashDialog isOpen={isOpen} toggle={onClose} />
    </div>
  );
}

export default CashAdvance;
