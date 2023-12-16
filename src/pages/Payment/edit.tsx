import {Spin} from "antd";
import {useGetPayment} from "hooks/query";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import FormPayment from "./components/FormPayment";

const EditPayment = () => {
  const {id} = useParams<{id: string; action: string}>();
  const parsedId = parseInt(id);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [formAction, setFormAction] = useState<string>();
  const {data: payment, isLoading} = useGetPayment(parsedId);

  useEffect(() => {
    setOpenForm(true);
    setFormAction("edit_payment");
  }, [formAction, openForm]);

  return isLoading ? (
    <>
      <Spin />
    </>
  ) : (
    <FormPayment paymentData={payment} />
  );
};

export default EditPayment;
