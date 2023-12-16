import {Spin} from "antd";
import {useGetOneInstructions} from "hooks/query";
import {useParams} from "react-router-dom";
import FormInstruction from "./components/FormInstruction";

type EditInstructionParams = {
  id: string;
};

const EditInstructionPage = () => {
  const {id} = useParams<EditInstructionParams>();
  const {data, isLoading} = useGetOneInstructions(id);

  return isLoading ? (
    <Spin />
  ) : (
    <FormInstruction instruction={data?.instruction} />
  );
};

export default EditInstructionPage;
