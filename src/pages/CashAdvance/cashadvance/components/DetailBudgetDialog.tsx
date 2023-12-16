import TextArea from "antd/es/input/TextArea";
import {InputField} from "components/hookform";
import {Modal} from "components/ui";
import {baseUrl} from "constans/config";
import {CashAdvanceData} from "interfaces";

type DialogProps = {
  isOpen: boolean;
  toggle: () => void;
  cashAdvance: CashAdvanceData | null;
};

const DetailBudgetDialog = ({isOpen, toggle, cashAdvance}: DialogProps) => {
  return (
    <Modal isOpen={isOpen} onClose={toggle} title="Detail Budget" footer={null}>
      <div className="mt-4">
        <form>
          <InputField
            name="companyContact"
            label="Nominal"
            labelclassName="font-medium"
            placeholder="Enter nominal"
            value={cashAdvance?.nominal}
          />
          <fieldset className="flex flex-col space-y-1 gap-[6px] mb-2">
            <label htmlFor="" className="font-medium text-sm">
              Description
            </label>
            <TextArea
              value={cashAdvance?.description}
              rows={5}
              placeholder="Enter description"
            />
          </fieldset>
          <fieldset className="space-y-1 gap-[6px]">
            <label htmlFor="" className="font-medium text-sm">
              Attachment Upload
            </label>
            <img
              src={`${baseUrl}/uploads/` + cashAdvance?.signature}
              alt="avatar"
              style={{width: "100%"}}
            />
          </fieldset>
        </form>
      </div>
    </Modal>
  );
};

export default DetailBudgetDialog;
