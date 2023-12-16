import {useGetPayment} from "hooks/query";
import {useParams} from "react-router";
import FormPayment from "./components/FormPayment";
import {Spin} from "antd";

const ViewPayment = () => {
  const {id} = useParams<{id: string}>();
  const {data: paymentData, isLoading: isLoadingPayment} = useGetPayment(
    parseInt(id),
  );

  return isLoadingPayment ? (
    <Spin />
  ) : (
    <FormPayment isView paymentData={paymentData} />
  );
};

export default ViewPayment;
