import {InsuredEntry} from "./components";
import PageTitle from "components/ui/PageTitle";

const AddVendor = () => {
  const addInsuredBreadcumbs = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Database",
      href: "/insured",
    },
    {
      title: "Add Insured",
    },
  ];
  return (
    <>
      <PageTitle
        pageTitle="Add Insured"
        pageBreadcrumbs={addInsuredBreadcumbs}
      />
      <InsuredEntry />
    </>
  );
};

export default AddVendor;
