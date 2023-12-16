import {useParams} from "react-router";
import FormInsurer from "./components/FormInsurer";
import {useGetCompany} from "hooks/query";
import InsurerEntry from "./components/InsurerEntry";
import PageTitle from "components/ui/PageTitle";
import FormContainer from "./components/FormContainer";

interface ParamEditPage {
  action: string;
  id: string;
}

const EditInsurer = () => {
  const {id} = useParams<ParamEditPage>();
  const {data} = useGetCompany(id);
  const editInsurerBreadcrumbs = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Insurers",
      href: "/insurer",
    },
    {
      title: "Edit Insurer",
    },
  ];

  return (
    <>
      <PageTitle
        pageTitle="Edit Insurer"
        pageBreadcrumbs={editInsurerBreadcrumbs}
      />
      <FormContainer>
        <InsurerEntry oldData={data?.data} />
      </FormContainer>
    </>
  );
};

export default EditInsurer;
