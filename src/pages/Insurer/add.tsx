import PageTitle from "components/ui/PageTitle";
import InsurerEntry from "./components/InsurerEntry";
import FormContainer from "./components/FormContainer";

const AddInsurer = () => {
  const addInsurerBreadcrumbs = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Insurers",
      href: "/insurer",
    },
    {
      title: "Add Insurer",
    },
  ];
  return (
    <>
      <PageTitle
        pageTitle="Add Insurer"
        pageBreadcrumbs={addInsurerBreadcrumbs}
      />
      <FormContainer>
        <InsurerEntry />
      </FormContainer>
    </>
  );
};

export default AddInsurer;
