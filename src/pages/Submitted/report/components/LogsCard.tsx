import {Divider, Spin, message} from "antd";
import {FaPlus} from "react-icons/fa";
import cx from "classnames";
import {useGetReport, useCreateComment, useGetListUsers} from "hooks/query";
import {useDisclosure} from "hooks";
import {Modal} from "components/ui";
import TextArea from "antd/es/input/TextArea";
import {SubmitHandler, useForm} from "react-hook-form";
import {
  CaseResponse,
  CommentMainData,
  CommentSchema,
  ReportData,
  ReportnameResponse,
  UserType,
  defaultApiListOptions,
} from "interfaces";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import jsCookie from "js-cookie";
import {formatDate} from "utils";
import {baseUrl} from "constans/config";
import Button from "components/ui/buttons/Button";
import { InputField } from "components/hookform";

const LogsCard = ({
  dataSubmitcase,
  dataReportname,
}: {
  dataSubmitcase: CaseResponse;
  dataReportname: ReportnameResponse;
}) => {
  // const {
  //   data: dataReport,
  //   isLoading: isLoadingReport,
  //   refetch,
  // } = useGetReport(report_id);  
  const {isOpen, onClose, onOpen} = useDisclosure();

  useEffect(() => {
    console.log(dataSubmitcase, 'dataSubmitcase 3334')
    console.log(dataReportname, 'dataReportname 3334')
  
    return () => {
      console.log(dataSubmitcase, 'dataSubmitcase 3334')
    }
  }, [dataSubmitcase])
  

  return (
    <>
      <div className="w-full mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg"> 
        <div className="pt-4 pb-5">
          <div className="px-5 flex flex-row justify-between items-center">
            <span className="text-xl">Logs</span> 
          </div>
          <Divider className="mt-4 mb-0" />
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <div className="mx-8 flex flex-row gap-4">  
              <div className="flex flex-col gap-2 text-sm w-full">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col">
                    <h3 className="font-medium">Adminx.</h3>
                    <div className="flex flex-row flex-nowrap whitespace-nowrap">
                      <span className="text-xs mr-1">
                        Status:
                      </span>
                      <strong className="text-xs text-red-600">
                        Pending
                      </strong>
                    </div>
                  </div>
                  <div className="text-xs ml-auto text-[#7A7A7A]">
                    {formatDate(new Date())}
                  </div>
                </div>
                <u onClick={() => onOpen()} className="text-blue-700 cursor-pointer">
                  See Detail
                </u>
              </div>
            </div> 
            <Divider className="mb-3" />
            <div className="mx-8 flex flex-row gap-4">  
              <div className="flex flex-col gap-2 text-sm w-full">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col">
                    <h3 className="font-medium">Adminx.</h3>
                    <div className="flex flex-row whitespace-nowrap">
                      <span className="text-xs mr-1">
                        Status:
                      </span>
                      <strong className="text-xs text-yellow-400">
                        In Progress
                      </strong>
                    </div>
                  </div>
                  <div className="text-xs ml-auto text-[#7A7A7A]">
                    {formatDate(new Date())}
                  </div>
                </div>
                <u onClick={() => onOpen()} className="text-blue-700 cursor-pointer">
                  See Detail
                </u>
              </div>
            </div> 
            <Divider className="mb-3" />

          </div>
        </div> 
      </div>
      <Modal isOpen={isOpen} onClose={onClose} title="Log Detail" footer={null}>
        <div className="mt-4">
            <InputField
              disabled
                type="date"
                // onChange={(event) => onChangeDatePicker("inv_date", event)}
                // defaultValue={defaultDate.toISOString().slice(0, 10)}
                name="instruction_date"
                label="Date Of Instruction"
                labelclassName="font-medium"
                placeholder="Enter Date Of Instruction"  
              />
              <InputField
                disabled
                type="date"
                name="reg_date"
                label="Date Of First Visit"
                labelclassName="font-medium"
                placeholder="Enter Date Of First Visit" 
              />
              <InputField
                disabled
                name="claim_no"
                label="Claim No."
                labelclassName="font-medium"
                placeholder="Enter Claim No." 
              />
              <InputField
                disabled
                name="policy_no"
                label="Policy No."
                labelclassName="font-medium"
                placeholder="Enter Policy No." 
              />
              <InputField
                disabled
                name="type_of_policy"
                label="Type Of Policy"
                labelclassName="font-medium"
                placeholder="Enter Type Of Policy" 
              />
              <InputField
                disabled
                name="certificate_no"
                label="Certificate No"
                labelclassName="font-medium"
                placeholder="Enter Certificate No" 
              />
              <InputField
                disabled
                name="insurence_reff_no"
                label="Insurance Reff No"
                labelclassName="font-medium"
                placeholder="Enter Insurance Reff No" 
              />
              <InputField
                disabled
                readOnly
                label="Insured Name"
                labelclassName="font-medium"
                placeholder="Enter Insured Name" 
              />
              <InputField
                disabled
                readOnly
                label="Insured Address"
                labelclassName="font-medium"
                placeholder="Enter Insured Address" 
              />
              <InputField
                disabled
                readOnly
                label="Broker Name"
                labelclassName="font-medium"
                placeholder="Enter Broker Name" 
              />
              <InputField
                disabled
                name="risk_location"
                label="Risk Location"
                labelclassName="font-medium"
                placeholder="Enter Risk Location" 
              />
              <InputField
                disabled
                type="date"
                name="date_of_loss"
                label="Time, Day And Date Of Loss"
                labelclassName="font-medium"
                placeholder="Enter Time, Day And Date Of Loss" 
              />
              <InputField
                disabled
                name="nature_of_loss"
                label="Nature Of Loss"
                labelclassName="font-medium"
                placeholder="Enter Nature Of Loss"  
              />
              <InputField
                disabled
                name="nature_of_loss"
                label="Loss Description"
                labelclassName="font-medium"
                placeholder="Enter Loss Description"  
              />
              <InputField
                disabled
                name="cause"
                label="Cause"
                labelclassName="font-medium"
                placeholder="Enter Cause"  
              />
              <InputField
                disabled
                readOnly
                label="Adjuster Name"
                labelclassName="font-medium"
                placeholder="Enter Adjuster Name" 
              />
              <InputField
                disabled
                name="co_adjuster"
                label="Co Adjuster"
                labelclassName="font-medium"
                placeholder="Enter Co Adjuster" 
              />
              <InputField
                disabled
                name="percentage_co_adjuster"
                label="Precentage Co Adjuster"
                labelclassName="font-medium"
                placeholder="Enter Precentage Co Adjuster" 
              />
              <InputField
                disabled
                name="total_sum_insured"
                label="Total Sum Insured"
                labelclassName="font-medium"
                placeholder="Enter Total Sum Insured" 
              />

            <div className="flex justify-end mt-8 space-x-4">
              <Button
                htmlType="button"
                type="default"
                onClick={onClose}
                className="bg-primary-300 text-base h-fit text-white hover:!text-white font-medium px-3 py-2 flex items-center justify-center">
                Close
              </Button> 
            </div> 
        </div>
      </Modal>
    </>
  );
};

export default LogsCard;
