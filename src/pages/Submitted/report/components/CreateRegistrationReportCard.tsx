import { yupResolver } from "@hookform/resolvers/yup";
import { Divider, message } from "antd";
import { InputField } from "components/hookform";
import { useRegistrationCase, useUpdateCompany } from "hooks/query";
import {
  CaseResponse,
  CompanyData,
  CompanySchema,
  RegistrationData,
  RegistrationCaseSchema,
  ReportnameResponse,
} from "interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import ActionCard from "./ActionCard";
import CommentCard from "./CommentCard";
import DropdownStatus from "./DropdownStatus";
import { useUser } from "hooks/atom/useAtom";
import LogsCard from "./LogsCard";

const CreateRegistrationReportCard = ({
  dataSubmitcase,
  dataReportname,
}: {
  dataSubmitcase: CaseResponse;
  dataReportname: ReportnameResponse;
}) => {
  const dataCompany = dataSubmitcase;
  const { user } = useUser();

  const { mutate: updateRegistration } = useRegistrationCase(dataSubmitcase.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationData>({
    defaultValues: {
      cause: dataCompany.cause ?? "",
      certificate_no: dataCompany.certificate_no ?? "",
      claim_no: dataCompany.claim_no ?? "",
      co_adjuster: dataCompany.co_adjuster ?? "",
      date_of_loss: dataCompany.date_of_loss ?? "",
      instruction_date: dataCompany.instruction_date ?? "",
      insurance_date: dataCompany.insurance_date ?? "",
      insurence_reff_no: dataCompany.insurence_reff_no ?? "",
      nature_of_loss: dataCompany.nature_of_loss ?? "",
      percentage_co_adjuster: dataCompany.percentage_co_adjuster ?? "",
      policy_no: dataCompany.policy_no ?? "",
      reg_date: dataCompany.reg_date ?? "",
      risk_location: dataCompany.risk_location ?? "",
      total_sum_insured: dataCompany.total_sum_insured ?? "",
      type_of_policy: dataCompany.type_of_policy ?? "",
    },
    resolver: yupResolver(RegistrationCaseSchema),
  });

  const onSubmit: SubmitHandler<RegistrationData> = (data) => {
    updateRegistration(data, {
      onSuccess: () => {
        message.success("Success Update Registration Module");
      },
      onError: () => {
        alert("error");
      },
    });
  };

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
          <form onSubmit={handleSubmit(onSubmit)} className="pb-4">
            <div className="mx-6">
              <InputField
                type="date"
                // onChange={(event) => onChangeDatePicker("inv_date", event)}
                // defaultValue={defaultDate.toISOString().slice(0, 10)}
                name="instruction_date"
                label="Date Of Instruction"
                labelclassName="font-medium"
                placeholder="Enter Date Of Instruction"
                errors={errors}
                isRequired={true}
                register={register}
              />
              <InputField
                type="date"
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
                type="date"
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
                register={register}
              />
              <InputField
                name="percentage_co_adjuster"
                label="Precentage Co Adjuster"
                labelclassName="font-medium"
                placeholder="Enter Precentage Co Adjuster"
                errors={errors}
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
        {["Admin", "Sekretaris"].includes(user?.roles ?? "") && (
          <ActionCard onSave={handleSubmit(onSubmit)} />
        )}
        {dataReportname.report_table &&
          dataReportname.report_table.length > 0 && (
            <CommentCard report_id={dataReportname.report_table[0].id ?? "0"} />
          )}

        <LogsCard dataReportname={dataReportname} dataSubmitcase={dataSubmitcase} />
      </div>
    </div>
  );
};

export default CreateRegistrationReportCard;
