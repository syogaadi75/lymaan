import {yupResolver} from "@hookform/resolvers/yup";
import {Button, Radio, message} from "antd";
import TextArea from "antd/es/input/TextArea";
import {Modal} from "components/ui";
import {useCreateCashAdvance} from "hooks/query";
import {CashAdvanceMainData, CashAdvanceSchema} from "interfaces";
import {SubmitHandler, useForm} from "react-hook-form";
import Upload from "components/ui/Upload";
import {useState} from "react";
import InputNumberField from "components/hookform/InputNumberField";

type DialogProps = {
  caseId: string;
  type: "Request" | "Return";
  isOpen: boolean;
  toggle: () => void;
  onSuccessCreate: () => void;
};

const CreateDialogCashAdvances = ({
  caseId,
  type,
  isOpen,
  toggle,
  onSuccessCreate,
}: DialogProps) => {
  const [description, setDescription] = useState("");

  const {mutate: createCashAdvance, isLoading} = useCreateCashAdvance();

  const defaultValues: CashAdvanceMainData = {
    case_id: parseInt(caseId),
    type: type,
    signature: "",
    description: "",
    nominal: "",
    is_case: true,
  };

  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
    control,
    reset,
  } = useForm<CashAdvanceMainData>({
    defaultValues: defaultValues,
    resolver: yupResolver(CashAdvanceSchema),
  });

  const resetData = () => {
    reset(defaultValues);
    setDescription("");
  };

  const onSubmit: SubmitHandler<CashAdvanceMainData> = (data) => {
    data.type = type;
    createCashAdvance(data, {
      onSuccess: () => {
        resetData();
        message.success("Success Create Cash Advance");
        onSuccessCreate();
        toggle();
      },
      onError: () => {
        alert("error");
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={toggle}
      title={type + " Cash"}
      footer={null}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4 flex flex-col gap-3">
          <InputNumberField
            fullwidth
            name="nominal"
            label="Nominal"
            labelclassName="font-medium"
            placeholder="Enter nominal"
            errors={errors}
            setValue={setValue}
            control={control}
          />
          <fieldset className="flex flex-col space-y-1 gap-[6px] mb-2">
            <label htmlFor="" className="font-medium text-sm">
              Description
            </label>
            <TextArea
              value={description}
              onChange={(e) => {
                setValue("description", e.target.value);
                setDescription(e.target.value);
              }}
              rows={5}
              placeholder="Enter description"
            />
            {errors.description && (
              <label htmlFor="" className="text-xs text-red-500">
                {errors.description?.message}
              </label>
            )}
          </fieldset>
          <fieldset className="flex flex-col space-y-1">
            <label htmlFor="role" className="font-medium">
              Type Case <span className="text-red-500"> &#42; </span>
            </label>
            <Radio.Group
              className="flex w-80"
              onChange={({target: {value}}) => setValue("is_case", value)}
              size="large"
              optionType="button"
              buttonStyle="solid"
              defaultValue={true}>
              <Radio.Button value={true}>Case</Radio.Button>
              <Radio.Button value={false}>Non Case</Radio.Button>
            </Radio.Group>
          </fieldset>
          <fieldset className="space-y-1 gap-[6px]">
            <label htmlFor="" className="font-medium text-sm">
              Attachment Upload
            </label>
            <div className="max-w-[200px]">
              <Upload
                name="signature"
                register={register}
                errors={errors}
                setValue={setValue}
                control={control}
              />
            </div>
          </fieldset>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="default"
            onClick={toggle}
            className="bg-primary-300 text-base h-fit text-white hover:!text-white font-medium px-3 py-2 flex items-center justify-center">
            Cancel
          </Button>
          <Button
            loading={isLoading}
            htmlType="submit"
            type="default"
            className="bg-primary-500 text-base h-fit text-white hover:!text-white font-medium px-3 py-2 flex items-center justify-center">
            Send {type}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateDialogCashAdvances;
