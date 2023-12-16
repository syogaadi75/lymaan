import {useParams} from "react-router";
import FormCase from "./components/FormCase";
import {Spin} from "antd";
import {useGetSubmitCase} from "hooks/query";

type EditUserParams = {
  id: string;
};

const EditCasePage = () => {
  const {id} = useParams<EditUserParams>();
  const {data, isLoading} = useGetSubmitCase(id);

  return isLoading ? <Spin /> : <FormCase submitcase={data} />;
};

export default EditCasePage;
