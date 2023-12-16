import {useState} from "react";
import ListTable from "./components/ListTable";
import {useParams} from "react-router";
import {Button, Divider, Radio} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  useCreateCashAdvance,
  useGetListCashAdvance,
  useGetSubmitCase,
} from "hooks/query";
import {yupResolver} from "@hookform/resolvers/yup";
import {
  CashAdvanceMainData,
  CashAdvanceSchema,
  defaultApiListOptions,
} from "interfaces";
import {SubmitHandler, useForm} from "react-hook-form";
import {Breadcrumb} from "components/ui";
import Upload from "components/ui/Upload";
import InputNumberField from "components/hookform/InputNumberField";

type DetailCashAdvanceParams = {
  id: string;
};

function DetailCashAdvance() {
  const {id} = useParams<DetailCashAdvanceParams>();
  const [description, setDescription] = useState("");

  const {data: dataSubmitCase} = useGetSubmitCase(id);
  const {
    data: dataCashAdvance,
    isLoading: isLoadingCashAdvance,
    refetch,
  } = useGetListCashAdvance(defaultApiListOptions);

  const {mutate: createCashAdvance, isLoading} = useCreateCashAdvance();

  const defaultValues: CashAdvanceMainData = {
    case_id: parseInt(id),
    type: "Budget",
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
    createCashAdvance(data, {
      onSuccess: () => {
        refetch();
        resetData();
      },
      onError: () => {
        alert("error");
      },
    });
  };

  return (
    <div>
      <div className="text-2xl font-medium">Add New Cash</div>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "Cash Advance",
            href: "/cash-advance",
          },
          {
            title: dataSubmitCase?.company.name,
          },
          {
            title: "Add New Cash",
          },
        ]}
      />
      <div className="w-full mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
        <div className="py-4 px-8">
          <span className="text-xl">Add New Cash To Adjuster</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Divider className="mt-0" />
          <div className="mx-8 pb-8 flex flex-col gap-5">
            <InputNumberField
              fullwidth
              className="max-w-sm"
              name="nominal"
              label="Nominal"
              labelclassName="font-medium"
              placeholder="Enter nominal"
              errors={errors}
              isRequired={true}
              setValue={setValue}
              control={control}
            />
            <fieldset className="flex flex-col space-y-1 gap-[6px]">
              <label htmlFor="" className="font-medium text-sm">
                Description
              </label>
              <TextArea
                onChange={(e) => {
                  setValue("description", e.target.value);
                  setDescription(e.target.value);
                }}
                value={description}
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
            <div className="flex flex-row self-end">
              <Button
                onClick={resetData}
                htmlType="button"
                type="default"
                className="mr-2 bg-primary-300 text-base h-fit text-white hover:!text-white font-medium px-3 py-2 flex items-center justify-center">
                Reset
              </Button>
              <Button
                loading={isLoading}
                htmlType="submit"
                type="default"
                className="bg-primary-500 text-base h-fit text-white hover:!text-white font-medium px-3 py-2 flex items-center justify-center">
                Add
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className="my-6 flex gap-8 min-w-inherit">
        <div className="bg-white flex flex-col basis-full rounded-lg overflow-hidden">
          <ListTable
            data={
              dataCashAdvance?.data.filter(
                (item) => item.case_id == parseInt(id),
              ) ?? []
            }
            isLoading={isLoadingCashAdvance}
          />
        </div>
      </div>
    </div>
  );
}

export default DetailCashAdvance;
