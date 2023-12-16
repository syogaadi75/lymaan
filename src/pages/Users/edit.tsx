import {Spin} from "antd";
import {useGetOneUser} from "hooks/query";
import {useParams} from "react-router-dom";
import FormUser from "./components/FormUser";

type EditUserParams = {
  id: string;
};

const EditUserPage = () => {
  const {id} = useParams<EditUserParams>();
  const {data, isLoading} = useGetOneUser(id);

  return isLoading ? <Spin /> : <FormUser user={data?.data} />;
};

export default EditUserPage;
