import {useHistory, useLocation} from "react-router";
import {useEffect, useState} from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import {InputField} from "components/hookform";
import {Button, Divider, Input, Space} from "antd";
import {
  InsurerDataResponse,
  InsurerData,
  SubmitInsurerType,
  SubmitInsurerSchema,
} from "interfaces";
import {yupResolver} from "@hookform/resolvers/yup";
import {useAddCompany, useUpdateCompany} from "hooks/query";
import {useNotification} from "hooks/atom/useAtom";

const InsurerEntry = ({
  oldData,
}: {
  oldData?: InsurerDataResponse<InsurerData>;
}) => {
  const {TextArea} = Input;
  const {push} = useHistory();
  const {pathname} = useLocation();
  const {setNotification: setNotifMsg} = useNotification();
  const [isEditPage, setIsEditPage] = useState<boolean>(false);
  const {register, handleSubmit, setValue, getValues, formState} =
    useForm<SubmitInsurerType>({resolver: yupResolver(SubmitInsurerSchema)});

  const {mutate: addInsurer, isLoading: isLoadingAdd} = useAddCompany();
  const {mutate: updateInsurer, isLoading: isLoadingUpdate} = useUpdateCompany(
    oldData?.id ?? 0,
  );

  const handleCancel = () => push("/insurer");

  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = e.target;
    setValue("address", value, {shouldValidate: true});
  };

  const onSubmitForm: SubmitHandler<SubmitInsurerType> = (data) => {
    if (oldData) {
      updateInsurer(data, {
        onSuccess: () => {
          setNotifMsg({
            notificationType: "success",
            notificationTitle: "Success update insurer",
            notificationDescription: "Insurer added successfully!",
          });
          push("/insurer");
        },
        onError: (error: any) => {
          setNotifMsg({
            notificationType: "error",
            notificationTitle: "Error update insurer",
            notificationDescription: error.message,
          });
        },
      });
    } else {
      addInsurer(data, {
        onSuccess: () => {
          setNotifMsg({
            notificationType: "success",
            notificationTitle: "Success add insurer",
            notificationDescription: "Insurer added successfully!",
          });
          push("/insurer");
        },
        onError: (error: any) => {
          setNotifMsg({
            notificationType: "error",
            notificationTitle: "Error add insurer",
            notificationDescription: error.message,
          });
        },
      });
    }
  };

  useEffect(() => {
    const regexEdit = /^\/insurer\/edit\/\d+$/;
    const regexAdd = /^\/insurer\/add$/;

    if (regexEdit.test(pathname)) {
      setIsEditPage(true);
    } else if (regexAdd.test(pathname)) {
      setIsEditPage(false);
    }
  }, [pathname, isEditPage]);

  useEffect(() => {
    if (oldData) {
      setValue("name", oldData.name, {shouldValidate: true});
      setValue("address", oldData.address, {shouldValidate: true});
      setValue("contact", oldData.contact, {shouldValidate: true});
      setValue("person_incharge", oldData.person_incharge, {
        shouldValidate: true,
      });
      setValue("email", oldData.email, {shouldValidate: true});
      setValue("phone", oldData.phone, {shouldValidate: true});
      setValue("website", oldData.website, {shouldValidate: true});
    }
  }, [oldData]);

  return (
    <>
      <div className="flex flex-col pt-3">
        <h1 className="text-2xl font-medium px-7">General Database</h1>
        <Divider />
      </div>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Space direction="vertical" className="px-6 pb-6 w-full" size={24}>
          <InputField
            isRequired
            name="name"
            register={register}
            errors={formState.errors}
            label="Insurer Name"
            labelclassName="text-lg font-medium"
            placeholder="Input insurer name"
          />
          <div className="flex flex-col gap-3">
            <label htmlFor="address" className="text-lg font-medium">
              Insurer Address <span className="text-red-500 text-lg">*</span>
            </label>
            <TextArea
              rows={3}
              name="address"
              value={getValues().address}
              onChange={handleTextarea}
              placeholder="Input address"
            />
            {formState.errors && (
              <span className="text-red-500 text-xs">
                {formState.errors.address?.message}
              </span>
            )}
          </div>
          <InputField
            isRequired
            name="contact"
            register={register}
            errors={formState.errors}
            label="Insurer Contact"
            labelclassName="text-lg font-medium"
            placeholder="Input insurer contact"
          />
          <InputField
            isRequired
            name="person_incharge"
            register={register}
            errors={formState.errors}
            label="Insurer Person in Charge"
            labelclassName="text-lg font-medium"
            placeholder="Input person in charge"
          />
          <InputField
            isRequired
            type="email"
            name="email"
            register={register}
            errors={formState.errors}
            label="Insurer Email Address"
            labelclassName="text-lg font-medium"
            placeholder="Input insurer email address"
          />
          <InputField
            isRequired
            type="tel"
            name="phone"
            register={register}
            errors={formState.errors}
            label="Insurer Phone Number"
            labelclassName="text-lg font-medium"
            placeholder="Input insurer phone number"
          />
          <InputField
            isRequired
            name="website"
            register={register}
            label="Insurer Website"
            errors={formState.errors}
            labelclassName="text-lg font-medium"
            placeholder="Input insurer website"
          />
          <div className="flex flex-row-reverse gap-4">
            <Button htmlType="submit">
              {isEditPage ? "Update Insurer" : "Add Insurer"}
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        </Space>
      </form>
    </>
  );
};

export default InsurerEntry;
