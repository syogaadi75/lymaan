import PageTitle from "components/ui/PageTitle";
import InsuredLists from "./components/InsuredLists";

const Vendor = () => {
  const insuredsBreadcumbs = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Database",
      href: "/insured",
    },
    {
      title: "Insureds",
    },
  ];
  return (
    <>
      <PageTitle pageTitle="Insureds" pageBreadcrumbs={insuredsBreadcumbs} />
      <InsuredLists />
    </>
  );
};

export default Vendor;
