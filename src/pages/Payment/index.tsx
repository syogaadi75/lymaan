import {Breadcrumb} from "components/ui";
import {TablePayments} from "./components/TablePayments";

const PaymentPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-medium mt-4">Payment</h1>
      <Breadcrumb
        className="mt-3"
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "Payment",
            href: "/payment",
          },
          {
            title: "Payments",
          },
        ]}
      />

      <TablePayments />
    </div>
  );
};

export default PaymentPage;
