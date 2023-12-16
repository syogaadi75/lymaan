import {useHistory} from "react-router";
import {useEffect} from "react";
import {Button, Divider, Input, Space} from "antd";
import {yupResolver} from "@hookform/resolvers/yup";
import {SubmitHandler, useForm} from "react-hook-form";
import {SubmitInsuredSchema, SubmitInsuredType, VendorData} from "interfaces";
import FormContainer from "./FormContainer";
import {InputField} from "components/hookform";
import {useAddVendor, useUpdateVendor} from "hooks/query";
import {useNotification} from "hooks/atom/useAtom";

type InsuredEntryType = {
  insured?: VendorData;
  insuredId?: string;
};

const InsuredEntry = ({insured, insuredId}: InsuredEntryType) => {
  const {push} = useHistory();
  const {setNotification} = useNotification();
  const {register, setValue, getValues, formState, handleSubmit} =
    useForm<SubmitInsuredType>({resolver: yupResolver(SubmitInsuredSchema)});
  const {mutate: addVendor, isLoading: lpadingAddVendor} = useAddVendor();
  const {mutate: updateVendor, isLoading: lpadingUpdateVendor} =
    useUpdateVendor(parseInt(insuredId ?? "0"));
  const onInputTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue("address", e.target.value, {shouldValidate: true});
  };
  const onSubmitEntry: SubmitHandler<SubmitInsuredType> = (data) => {
    if (insured) {
      updateVendor(data, {
        onSuccess: () => {
          setNotification({
            notificationType: "success",
            notificationTitle: "Success update insured",
            notificationDescription: "Insured updated successfully!",
          });
          push("/insured");
        },
        onError: (error: any) => {
          const errors = error.data;
          const errorsArray = Object.keys(errors).map((error) => {
            return {
              [error]: errors[error][0],
            };
          });
          const convertedErrors: VendorData[] = [
            Object.assign({}, ...errorsArray),
          ];
          setNotification({
            notificationType: "error",
            notificationTitle: "Error update insured",
            notificationDescription: (
              <Space size={12}>
                {convertedErrors.map((error) => (
                  <ol className="list-none" key={error.id}>
                    {error.phone && (
                      <li className="flex flex-wrap gap-1">
                        <p className="text-xs">Contact</p>
                        <p className="text-xs flex flex-wrap gap-2">
                          <span>:</span> {error.phone}
                        </p>
                      </li>
                    )}
                    {error.email && (
                      <li className="flex flex-wrap gap-1">
                        <p className="text-xs">Email</p>
                        <p className="text-xs flex flex-wrap gap-2">
                          <span>:</span> {error.email}
                        </p>
                      </li>
                    )}
                    {error.website && (
                      <li className="flex flex-wrap gap-1">
                        <p className="text-xs">Website</p>
                        <p className="text-xs flex flex-wrap gap-2">
                          <span>:</span> {error.website}
                        </p>
                      </li>
                    )}
                  </ol>
                ))}
              </Space>
            ),
          });
        },
      });
    } else {
      addVendor(data, {
        onSuccess: () => {
          setNotification({
            notificationType: "success",
            notificationTitle: "Success add insured",
            notificationDescription: "Insured added successfully!",
          });
          push("/insured");
        },
        onError: (error: any) => {
          setNotification({
            notificationType: "error",
            notificationTitle: "Error add insured",
            notificationDescription: error.message,
          });
        },
      });
    }
  };
  useEffect(() => {
    if (insured) {
      setValue("name", insured.name, {shouldValidate: true});
      setValue("address", insured.address, {shouldValidate: true});
      setValue("type_vendor", insured.type_vendor, {shouldValidate: true});
      setValue("phone", insured.phone, {shouldValidate: true});
      setValue("pic", insured.pic, {
        shouldValidate: true,
      });
      setValue("email", insured.email, {shouldValidate: true});
      setValue("website", insured.website, {shouldValidate: true});
    }
  }, [insured]);
  return (
    <FormContainer>
      {insured && (
        <>
          <h1 className="text-lg">{insured.name} ( Insured )</h1>
          <Divider className="mb-4" />
        </>
      )}
      <form className="p-[30px]" onSubmit={handleSubmit(onSubmitEntry)}>
        <InputField
          isRequired
          name="name"
          register={register}
          errors={formState.errors}
          label="Insured Name"
          labelclassName="text-md font-medium mb-3"
          placeholder="Input insured name"
        />
        <InputField
          isRequired
          name="type_vendor"
          register={register}
          errors={formState.errors}
          label="Insured Type"
          labelclassName="text-md font-medium mb-3"
          placeholder="Input insured type"
        />
        <div className="space-y-3 mt-6 mb-3">
          <label htmlFor="address" className="text-md font-medium my-3">
            Insured Address <span className="text-red-500">*</span>
          </label>
          <Input.TextArea
            rows={3}
            name="address"
            value={getValues().address}
            onChange={onInputTextarea}
            placeholder="Input insured address"
          />
          {formState.errors && (
            <span className="text-red-500 text-xs">
              {formState.errors.address?.message}
            </span>
          )}
        </div>
        <InputField
          isRequired
          name="phone"
          register={register}
          errors={formState.errors}
          label="Insured Contact"
          labelclassName="text-md font-medium my-3"
          placeholder="Input insured contact / phone number"
        />
        <InputField
          isRequired
          name="pic"
          register={register}
          errors={formState.errors}
          label="Insured Person In Charge"
          labelclassName="text-md font-medium my-3"
          placeholder="Input insured person in charge"
        />
        <InputField
          isRequired
          name="email"
          register={register}
          errors={formState.errors}
          label="Insured Email Address"
          labelclassName="text-md font-medium my-3"
          placeholder="Input insured email address"
        />
        <InputField
          isRequired
          name="website"
          register={register}
          errors={formState.errors}
          label="Insured Website"
          labelclassName="text-md font-medium my-3"
          placeholder="Input insured name"
        />
        <div className="flex justify-end gap-4 pt-5">
          <Button
            onClick={() => push("/insured")}
            className="text-lg flex items-center p-[22.5px] rounded-lg text-white bg-primary-200">
            Cancel
          </Button>
          <Button
            htmlType="submit"
            className="text-lg flex items-center p-[22.5px] rounded-lg text-white bg-primary-600">
            Save
          </Button>
        </div>
      </form>
    </FormContainer>
  );
};

export default InsuredEntry;
