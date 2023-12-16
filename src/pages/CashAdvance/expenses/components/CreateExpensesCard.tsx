import Upload from "components/ui/Upload";
import {Button, Divider, Radio, message} from "antd";
import {InputField} from "components/hookform";
import {yupResolver} from "@hookform/resolvers/yup";
import {ExpensesMainData, ExpensesSchema, expensesList} from "interfaces";
import {SubmitHandler, useForm} from "react-hook-form";
import cx from "classnames";
import {useEffect, useState} from "react";
import {useCreateExpenses} from "hooks/query";
import InputNumberField from "components/hookform/InputNumberField";

type CreateExpensesCardProps = {
  id: string;
  refetch: () => void;
};

const CreateExpensesCard = ({id, refetch}: CreateExpensesCardProps) => {
  const [typeValue, setTypeValue] = useState("");
  const [typeOtherValue, setTypeOtherValue] = useState("");
  const [expensesValue, setExpensesValue] = useState("");
  const [expensesOtherValue, setExpensesOtherValue] = useState("");
  const {mutate: createExpenses, isLoading} = useCreateExpenses();

  const defaultValues: ExpensesMainData = {
    attachment: "",
    case_id: parseInt(id),
    expenses: "",
    nominal: "",
    type: "",
    is_case: true,
  };

  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
    reset,
    control,
  } = useForm<ExpensesMainData>({
    defaultValues: defaultValues,
    resolver: yupResolver(ExpensesSchema),
  });

  const resetData = () => {
    reset(defaultValues);
    setExpensesValue("");
    setTypeValue("");
    setExpensesOtherValue("");
    setTypeOtherValue("");
  };

  const onSubmit: SubmitHandler<ExpensesMainData> = (data) => {
    if (data.expenses == "Other Expenses") {
      data.expenses = expensesOtherValue;
    }

    if (data.type == "Other") {
      data.type = typeOtherValue;
    }

    createExpenses(data, {
      onSuccess: () => {
        message.success("Successs Create Expenses");
        refetch();
        resetData();
      },
      onError: () => {
        alert("error");
      },
    });
  };

  useEffect(() => {
    const cek = expensesList.find(
      (item) => item.expenses == expensesValue,
    )?.type;
    if (cek) {
      if (cek.length == 0) {
        setValue("type", "other");
      } else {
        setValue("type", "");
      }
    }
  }, [expensesValue]);

  return (
    <div className="w-full mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
      <div className="py-4 px-8">
        <span className="text-xl">Add Expenses</span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Divider className="mt-0" />
        <div className="mx-8 pb-8 flex flex-col gap-3">
          <div className="flex flex-col-2 gap-4">
            <fieldset className="flex flex-col space-y-1">
              <label htmlFor="role" className="font-medium">
                Type Expenses <span className="text-red-500"> &#42; </span>
              </label>
              <select
                {...register("expenses")}
                onChange={(e) => {
                  setValue("expenses", e.target.value);
                  setExpensesValue(e.target.value as string);

                  if (e.target.value == "Other Expenses") {
                    setValue("type", "other");
                  }
                }}
                className="border border-solid border-[#d6d6d6] rounded-md py-2 px-2 transition-colors hover:border-[#40a9ff] focus:outline-[#40a9ff] focus:border-[#40a9ff] focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]"
                defaultValue="">
                <option value="" disabled>
                  Select Expenses
                </option>
                {expensesList.map((expenses, index) => (
                  <option value={expenses.expenses} key={index}>
                    {expenses.expenses}
                  </option>
                ))}
                <option disabled style={{fontSize: "0.25em"}}></option>
                <option
                  disabled
                  style={{
                    background: "#c9c9c9",
                    fontSize: "0.1px",
                  }}></option>
                <option disabled style={{fontSize: "0.25em"}}></option>
                <option value="Other Expenses">Other Expenses</option>
              </select>
            </fieldset>
            <InputField
              className={cx({
                hidden: expensesValue != "Other Expenses",
              })}
              register={register}
              labelclassName={cx("font-medium", {
                hidden: expensesValue != "Other Expenses",
              })}
              name="report_name"
              label="Type Expenses"
              placeholder="Enter Expenses Name"
              onChange={(e) => {
                setExpensesOtherValue(e.target.value);
              }}
            />
            {(expensesList.find((item) => item.expenses == expensesValue)?.type
              .length ?? 0) > 0 ? (
              <div className="flex flex-col-2 gap-3">
                <fieldset className="flex flex-col space-y-1">
                  <label htmlFor="role" className="font-medium">
                    Type {expensesValue}
                    <span className="text-red-500"> &#42; </span>
                  </label>
                  <select
                    {...register("type")}
                    onChange={(e) => {
                      setValue("type", e.target.value);
                      setTypeValue(e.target.value as string);
                    }}
                    className="border border-solid border-[#d6d6d6] rounded-md py-2 px-2 transition-colors hover:border-[#40a9ff] focus:outline-[#40a9ff] focus:border-[#40a9ff] focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]"
                    defaultValue="">
                    <option value="" disabled>
                      Select Type {expensesValue}
                    </option>
                    {(
                      expensesList.find(
                        (item) => item.expenses == expensesValue,
                      )?.type ?? []
                    ).map((expenses, index) => (
                      <option value={expenses} key={index}>
                        {expenses}
                      </option>
                    ))}
                    <option disabled style={{fontSize: "0.25em"}}></option>
                    <option
                      disabled
                      style={{
                        background: "#c9c9c9",
                        fontSize: "0.1px",
                      }}></option>
                    <option disabled style={{fontSize: "0.25em"}}></option>
                    <option value={"Other"}>Other {expensesValue}</option>
                  </select>
                </fieldset>
                <InputField
                  className={cx({
                    hidden: typeValue != "Other",
                  })}
                  labelclassName={cx("font-medium", {
                    hidden: typeValue != "Other",
                  })}
                  label={"Name " + expensesValue}
                  placeholder={`Enter ${expensesValue} Name`}
                  onChange={(e) => {
                    setTypeOtherValue(e.target.value);
                  }}
                />
              </div>
            ) : (
              expensesValue && (
                <InputField
                  labelclassName={cx("font-medium")}
                  label={"Type " + expensesValue}
                  placeholder={`Enter ${expensesValue} Type`}
                  onChange={(e) => {
                    setTypeOtherValue(e.target.value);
                  }}
                />
              )
            )}
          </div>
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
          <InputNumberField
            fullwidth
            className="max-w-xs"
            name="nominal"
            label="Nominal"
            labelclassName="font-medium"
            placeholder="Enter nominal"
            errors={errors}
            isRequired={true}
            control={control}
            setValue={setValue}
          />
          <fieldset className="space-y-1">
            <label htmlFor="" className="font-medium text-sm">
              Attachment Upload
            </label>
            <div className="max-w-[200px]">
              <Upload
                name="attachment"
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
  );
};

export default CreateExpensesCard;
