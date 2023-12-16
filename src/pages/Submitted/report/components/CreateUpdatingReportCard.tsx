import {yupResolver} from "@hookform/resolvers/yup";
import {Button, Divider, Input, Space, Tooltip, message} from "antd";
import {InputField} from "components/hookform";
import {
  useGetAdjusterFee,
  useGetCaseReportNames,
  useRegistrationCase,
  useUpdateCompany,
  useUpdatingCase,
} from "hooks/query";
import {
  CaseResponse,
  CompanyData,
  CompanySchema,
  GetAdjustmentFeeResponse,
  ReportnameResponse,
  UpdatingData,
  UpdatingCaseSchema,
  RegistrationData,
  RegistrationCaseSchema,
} from "interfaces";
import {SubmitHandler, useForm} from "react-hook-form";
import ActionCard from "./ActionCard";
import ExpensesCard from "./ExpensesCard";
import CommentCard from "./CommentCard";
import {useEffect, useState} from "react";
import InputNumberField from "components/hookform/InputNumberField";
import DropdownStatus from "./DropdownStatus";
import {formatNumberWithCurrency} from "utils";
import {BsPercent} from "react-icons/bs";
import {useUser} from "hooks/atom/useAtom";
import LogsCard from "./LogsCard";

const CreateUpdatingReportCard = ({
  dataSubmitcase,
  dataReportname,
}: {
  dataSubmitcase: CaseResponse;
  dataReportname: ReportnameResponse;
}) => {
  const {user} = useUser();

  const [showClaimAjdustment, setShowClaimAdjustment] = useState(false);

  useGetCaseReportNames(dataSubmitcase.id, (data) => {
    console.log(data);

    if (data) {
      const finalReport = data.filter(
        (item) => item.report_name == "Draft Final Report",
      );

      if (finalReport.length > 0) setShowClaimAdjustment(true);

      console.log(finalReport);
    }
  });

  const {mutate: updateRegistration} = useRegistrationCase(dataSubmitcase.id);
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<RegistrationData>({
    defaultValues: dataSubmitcase,
    resolver: yupResolver(RegistrationCaseSchema),
  });

  const onSubmit: SubmitHandler<RegistrationData> = (data) => {
    updateRegistration(data, {
      onSuccess: () => {
        message.success("Successs Update Module");
      },
      onError: () => {
        alert("error");
      },
    });
  };

  // UPDATE CARD
  const {
    handleSubmit: handleSubmitUpdate,
    setValue,
    formState: {errors: errorsUpdate},
    getValues,
    control,
  } = useForm<UpdatingData>({
    defaultValues: {
      marine_police: dataSubmitcase.marine_police ?? "non marine",
      currency: dataSubmitcase.currency ?? "idr",
      reverse: dataSubmitcase.reverse ?? 0,
      estimasi_fee: dataSubmitcase.estimasi_fee ?? 0,
      claim_adjustment: dataSubmitcase.claim_adjustment ?? 0,
      claim_adjustment_fee: dataSubmitcase.claim_adjustment_fee ?? 0,
      diskon: dataSubmitcase.diskon ?? 0,
      total_invoice: dataSubmitcase.diskon ?? 0,
    },
    resolver: yupResolver(UpdatingCaseSchema),
  });

  const {mutate: updatingCase} = useUpdatingCase(dataSubmitcase?.id ?? "");

  const [currency, setCurrency] = useState<"idr" | "usd">(
    dataSubmitcase.currency,
  );
  const [diskon, setDiskon] = useState(Math.round(dataSubmitcase.diskon));

  const refreshTotalInvoice = () => {
    const claim_adjustment_fee = getValues().claim_adjustment_fee;

    const total_invoice =
      claim_adjustment_fee - (claim_adjustment_fee * diskon) / 100;

    setValue("total_invoice", total_invoice, {
      shouldValidate: true,
    });
  };

  const {mutate: getEstimasiFee} = useGetAdjusterFee(
    (value: GetAdjustmentFeeResponse) => {
      setValue("estimasi_fee", value.claim_adjustment_fee ?? 0);
      refreshTotalInvoice();
    },
  );

  const {mutate: getAdjusterFee} = useGetAdjusterFee(
    (value: GetAdjustmentFeeResponse) => {
      setValue("claim_adjustment_fee", value.claim_adjustment_fee ?? 0);
    },
  );

  const onSubmitUpdate: SubmitHandler<UpdatingData> = (data) => {
    updatingCase(data, {
      onSuccess: () => {
        // message.success("Successs Update Module");
      },
    });
  };

  const onChangeReverse = (
    currency: "idr" | "usd",
    adjustmentFee: number,
    marine_police: string,
  ) => {
    getEstimasiFee({
      currency: currency,
      claim_adjustment: adjustmentFee,
      marine: marine_police == "marine cargo",
    });
  };

  const onChangeClaimAdjusment = (
    currency: "idr" | "usd",
    adjustmentFee: number,
    marine_police: string,
  ) => {
    getAdjusterFee({
      currency: currency,
      claim_adjustment: adjustmentFee,
      marine: marine_police == "marine cargo",
    });
  };

  useEffect(() => {
    setValue("diskon", diskon, {
      shouldValidate: true,
    });

    refreshTotalInvoice();
  }, [diskon]);

  return (
    <div className="flex flex-row gap-8">
      <div className="w-7/12">
        <div className="w-full mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
          <div className="py-4 px-8 flex justify-between">
            <span className="text-xl"></span>
            {dataReportname && (
              <DropdownStatus dataReportname={dataReportname} />
            )}
          </div>
          <Divider className="mt-0" />
          <form className="pb-4">
            <div className="mx-6">
              <InputField
                name="instruction_date"
                label="Date Of Instruction"
                labelclassName="font-medium"
                placeholder="Enter Date Of Instruction"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                name="reg_date"
                label="Date Of First Visit"
                labelclassName="font-medium"
                placeholder="Enter Date Of First Visit"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                name="claim_no"
                label="Claim No."
                labelclassName="font-medium"
                placeholder="Enter Claim No."
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                name="policy_no"
                label="Policy No."
                labelclassName="font-medium"
                placeholder="Enter Policy No."
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                name="type_of_policy"
                label="Type Of Policy"
                labelclassName="font-medium"
                placeholder="Enter Type Of Policy"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                name="certificate_no"
                label="Certificate No"
                labelclassName="font-medium"
                placeholder="Enter Certificate No"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                name="insurence_reff_no"
                label="Insurance Reff No"
                labelclassName="font-medium"
                placeholder="Enter Insurance Reff No"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                readOnly
                label="Insured Name"
                labelclassName="font-medium"
                placeholder="Enter Insured Name"
                value={dataSubmitcase.vendor.name}
              />
              <InputField
                readOnly
                label="Insured Address"
                labelclassName="font-medium"
                placeholder="Enter Insured Address"
                value={dataSubmitcase.vendor.address}
              />
              <InputField
                readOnly
                label="Broker Name"
                labelclassName="font-medium"
                placeholder="Enter Broker Name"
                defaultValue={dataSubmitcase.brokers[0].name}
              />
              <InputField
                name="risk_location"
                label="Risk Location"
                labelclassName="font-medium"
                placeholder="Enter Risk Location"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                name="date_of_loss"
                label="Time, Day And Date Of Loss"
                labelclassName="font-medium"
                placeholder="Enter Time, Day And Date Of Loss"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                name="nature_of_loss"
                label="Nature Of Loss"
                labelclassName="font-medium"
                placeholder="Enter Nature Of Loss"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                name="nature_of_loss"
                label="Loss Description"
                labelclassName="font-medium"
                placeholder="Enter Loss Description"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                name="cause"
                label="Cause"
                labelclassName="font-medium"
                placeholder="Enter Cause"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                readOnly
                label="Adjuster Name"
                labelclassName="font-medium"
                placeholder="Enter Adjuster Name"
                value={dataSubmitcase.adjusters[0].name}
              />
              <InputField
                name="co_adjuster"
                label="Co Adjuster"
                labelclassName="font-medium"
                placeholder="Enter Co Adjuster"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                name="percentage_co_adjuster"
                label="Precentage Co Adjuster"
                labelclassName="font-medium"
                placeholder="Enter Precentage Co Adjuster"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                name="total_sum_insured"
                label="Total Sum Insured"
                labelclassName="font-medium"
                placeholder="Enter Total Sum Insured"
                errors={errors}
                isRequired={true}
                register={register}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="w-5/12">
        {["Admin", "Adjuster", "Keuangan", "Direktur"].includes(
          user?.roles ?? "",
        ) && (
          <ActionCard
            onSave={handleSubmit(onSubmit)}
            onSave2={handleSubmitUpdate(onSubmitUpdate)}
          />
        )}
        <form>
          <div className="w-full mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
            <div className="py-4">
              <div className="px-5 flex flex-row justify-between items-center">
                <span className="text-xl">Fee for Insurer</span>
              </div>
              <Divider className="mt-4 mb-0 pb-5" />
              <div className="mx-6 mb-2 flex flex-col gap-3">
                <fieldset className="flex flex-col space-y-1 gap-[6px]">
                  <label className="font-medium text-sm">
                    Marine Policy <span className="text-red-500"> &#42; </span>
                  </label>
                  <select
                    defaultValue={dataSubmitcase.marine_police}
                    onChange={(e) => {
                      const marine_police = e.target.value;

                      setValue("marine_police", marine_police, {
                        shouldValidate: true,
                      });
                      onChangeClaimAdjusment(
                        getValues().currency,
                        getValues().claim_adjustment,
                        marine_police,
                      );
                      onChangeReverse(
                        getValues().currency,
                        parseInt(getValues().reverse),
                        marine_police,
                      );
                      setCurrency(currency);
                    }}
                    className="border border-solid border-[#d6d6d6] rounded-md py-2 px-2 transition-colors hover:border-[#40a9ff] focus:outline-[#40a9ff] focus:border-[#40a9ff] focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]">
                    <option value="" disabled>
                      Select Marine Policy
                    </option>
                    <option value="non marine">Non Marine</option>
                    <option value="marine cargo">Marine Cargo</option>
                  </select>
                </fieldset>
                <fieldset className="flex flex-col space-y-1 gap-[6px]">
                  <label className="font-medium text-sm">
                    Currency <span className="text-red-500"> &#42; </span>
                  </label>
                  <select
                    value={getValues().currency}
                    onChange={(e) => {
                      const currency = e.target.value as "idr" | "usd";
                      setValue("currency", currency, {
                        shouldValidate: true,
                      });
                      onChangeClaimAdjusment(
                        currency,
                        getValues().claim_adjustment,
                        getValues().marine_police,
                      );
                      onChangeReverse(
                        currency,
                        parseInt(getValues().reverse),
                        getValues().marine_police,
                      );
                      setCurrency(currency);
                    }}
                    className="border border-solid border-[#d6d6d6] rounded-md py-2 px-2 transition-colors hover:border-[#40a9ff] focus:outline-[#40a9ff] focus:border-[#40a9ff] focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]">
                    <option value="" disabled>
                      Select Currency
                    </option>
                    <option value="idr">IDR (Indonesia Rupiah)</option>
                    <option value="usd">USD (United States Dollar)</option>
                  </select>
                </fieldset>
                <InputNumberField
                  readOnly={
                    !["Admin", "Adjuster", "Direktur"].includes(
                      user?.roles ?? "",
                    )
                  }
                  fullwidth
                  name="reverse"
                  label="Reserve"
                  labelclassName="font-medium"
                  placeholder="Enter Amount"
                  errors={errorsUpdate}
                  isRequired={true}
                  control={control}
                  setValue={setValue}
                  defaultValue={parseFloat(dataSubmitcase.reverse)}
                  currency={currency}
                  onChange={(event) => {
                    onChangeReverse(
                      currency,
                      parseInt(`${event}`),
                      getValues().reverse,
                    );
                  }}
                />
                <Tooltip
                  title={formatNumberWithCurrency(
                    getValues().estimasi_fee,
                    getValues().currency,
                  )}>
                  <div>
                    <InputNumberField
                      fullwidth
                      readOnly
                      name="estimasi_fee"
                      label="Estimasi Fee"
                      labelclassName="font-medium"
                      placeholder="Enter Amount"
                      errors={errorsUpdate}
                      isRequired={true}
                      control={control}
                      setValue={setValue}
                      defaultValue={dataSubmitcase.estimasi_fee}
                      currency={currency}
                    />
                  </div>
                </Tooltip>
                <div hidden={!showClaimAjdustment}>
                  <InputNumberField
                    readOnly={
                      !["Admin", "Adjuster", "Direktur"].includes(
                        user?.roles ?? "",
                      )
                    }
                    fullwidth
                    name="claim_adjustment"
                    label="Claim Adjusment"
                    labelclassName="font-medium"
                    placeholder="Enter Amount"
                    errors={errorsUpdate}
                    isRequired={true}
                    control={control}
                    setValue={setValue}
                    defaultValue={dataSubmitcase.claim_adjustment}
                    currency={currency}
                    onChange={(value) => {
                      onChangeClaimAdjusment(
                        currency,
                        parseInt(`${value}`),
                        getValues().reverse,
                      );
                    }}
                  />
                  <Tooltip
                    title={formatNumberWithCurrency(
                      getValues().claim_adjustment_fee,
                      getValues().currency,
                    )}>
                    <div>
                      <InputNumberField
                        fullwidth
                        readOnly
                        name="claim_adjustment_fee"
                        label="Fee"
                        labelclassName="font-medium"
                        placeholder="Enter Amount"
                        errors={errorsUpdate}
                        isRequired={true}
                        control={control}
                        setValue={setValue}
                        defaultValue={dataSubmitcase.claim_adjustment_fee}
                        currency={currency}
                      />
                    </div>
                  </Tooltip>
                  <fieldset>
                    <label className="font-medium text-sm">
                      Discount <span className="text-red-500"> &#42; </span>
                    </label>
                    <div className="flex items-center">
                      <Button
                        className="h-[45px]"
                        onClick={() => setDiskon(diskon - 1)}>
                        -
                      </Button>
                      <Input
                        type="number"
                        style={{width: 80, height: 44}}
                        suffix={<BsPercent size={20} color="grey" />}
                        step={0}
                        value={getValues().diskon}
                        onChange={(e) => {
                          let value = parseInt(e.target.value);
                          value = Number.isNaN(value) ? 0 : value;
                          value = value > 100 ? 100 : value;
                          setDiskon(value);
                        }}
                      />
                      <Button
                        className="h-[45px]"
                        onClick={() => setDiskon(diskon + 1.0)}>
                        +
                      </Button>
                    </div>
                  </fieldset>
                  <Tooltip
                    title={formatNumberWithCurrency(
                      getValues().total_invoice,
                      getValues().currency,
                    )}>
                    <div>
                      <InputNumberField
                        fullwidth
                        readOnly
                        name="total_invoice"
                        label="Total Invoice"
                        labelclassName="font-medium"
                        placeholder="Enter Amount"
                        errors={errorsUpdate}
                        isRequired={true}
                        control={control}
                        setValue={setValue}
                        defaultValue={dataSubmitcase.total_invoice}
                        currency={currency}
                      />
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </form>
        <ExpensesCard dataSubmitcase={dataSubmitcase} />
        {dataReportname.report_table &&
          dataReportname.report_table.length > 0 && (
            <CommentCard report_id={dataReportname.report_table[0].id ?? "0"} />
          )}

        <LogsCard
          dataReportname={dataReportname}
          dataSubmitcase={dataSubmitcase}
        />
      </div>
    </div>
  );
};

export default CreateUpdatingReportCard;
