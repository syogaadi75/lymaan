import {useEffect} from "react";
import {useHistory} from "react-router";
import {useForm, SubmitHandler} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

import {Button, Input, Space} from "antd";
import FormContainer from "./FormContainer";
import {InputField} from "components/hookform";

import {useAtom} from "jotai";
import {useAddBroker, useUpdateBroker} from "hooks/query";
import {notificationAtom} from "hooks/atom/useAtom";
import {BrokerEntryDatas, BrokersApiType, SubmitBrokerSchema} from "interfaces";

interface BrokerEntryType {
  broker?: BrokersApiType;
  isAddBroker?: boolean;
  isUpdateBroker?: boolean;
}

const BrokerEntry = ({
  broker,
  isAddBroker,
  isUpdateBroker,
}: BrokerEntryType) => {
  const {TextArea} = Input;
  const brokerId = broker?.id ?? 0;
  const {push} = useHistory();
  const [notifMsg, setNotifMsg] = useAtom(notificationAtom);
  const {handleSubmit, setValue, getValues, register, formState} =
    useForm<BrokerEntryDatas>({resolver: yupResolver(SubmitBrokerSchema)});

  const {mutate: addBroker} = useAddBroker();
  const {mutate: updateBroker} = useUpdateBroker(brokerId);

  const handleChangeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = e.target;
    setValue("address", value, {shouldValidate: true});
  };

  const onSubmitForm: SubmitHandler<BrokerEntryDatas> = (data) => {
    if (broker) {
      updateBroker(data, {
        onSuccess: () => {
          setNotifMsg({
            notificationType: "success",
            notificationTitle: "Success updated data",
            notificationDescription: "Broker data updated successfully!",
          });
          push("/brokers");
        },
        onError: (error: any) => {
          setNotifMsg({
            notificationType: "error",
            notificationTitle: "Error updating data",
            notificationDescription: error.message,
          });
        },
      });
    } else {
      addBroker(data, {
        onSuccess: () => {
          setNotifMsg({
            notificationType: "success",
            notificationTitle: "Success add broker!",
            notificationDescription: "Add broker success!",
          });
          push("/brokers");
        },
        onError: (error: any) => {
          setNotifMsg({
            notificationType: "error",
            notificationTitle: "Error add broker!",
            notificationDescription: error.message,
          });
        },
      });
    }
  };

  useEffect(() => {
    if (isUpdateBroker && broker) {
      setValue("name", broker.name, {shouldValidate: true});
      setValue("phone", broker.phone, {shouldValidate: true});
      setValue("company", broker.company, {shouldValidate: true});
      setValue("address", broker.address, {shouldValidate: true});
      setValue("affiliation", broker.affiliation, {shouldValidate: true});
    }
  }, [broker, isUpdateBroker]);

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="pb-3">
          <InputField
            isRequired
            name="name"
            register={register}
            label="Broker Full Name"
            labelclassName="text-xl pb-3"
            errors={formState.errors}
          />
          <Space direction="vertical" className="w-full mt-3 mb-5">
            <label htmlFor="address" className="text-xl pb-3">
              Broker Address <span className="text-red-500">*</span>
            </label>
            <TextArea
              rows={3}
              name="address"
              value={getValues().address}
              onChange={handleChangeTextarea}
            />
            {formState.errors && (
              <span className="text-red-500 text-xs">
                {formState.errors.address?.message}
              </span>
            )}
          </Space>
          <InputField
            isRequired
            type="tel"
            name="phone"
            register={register}
            label="Broker Phone Number"
            labelclassName="text-xl pb-3"
            errors={formState.errors}
          />
          <InputField
            isRequired
            name="company"
            register={register}
            label="Broker Insurer"
            labelclassName="text-xl pb-3 mt-3"
            errors={formState.errors}
          />
          <InputField
            isRequired
            name="affiliation"
            register={register}
            label="Broker Affiliation / Source"
            labelclassName="text-xl pb-3 mt-3"
            errors={formState.errors}
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            type="ghost"
            onClick={() => push("/brokers")}
            className="flex items-center text-lg px-5 py-6 bg-primary-200 text-white rounded-xl">
            Cancel
          </Button>
          <Button
            type="ghost"
            htmlType="submit"
            className="flex items-center text-lg px-5 py-6 bg-primary-500 text-white rounded-xl">
            {isAddBroker ? "Add Broker" : isUpdateBroker ? "Save" : null}
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default BrokerEntry;
