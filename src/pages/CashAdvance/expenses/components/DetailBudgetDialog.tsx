import {InputField} from "components/hookform";
import {Modal} from "components/ui";
import {baseUrl} from "constans/config";
import {ExpensesData} from "interfaces";

type DialogProps = {
  isOpen: boolean;
  toggle: () => void;
  cashAdvance: ExpensesData | null;
};

const DetailBudgetDialog = ({
  isOpen,
  toggle,
  cashAdvance: expenses,
}: DialogProps) => {
  return (
    <Modal isOpen={isOpen} onClose={toggle} title="Detail Budget" footer={null}>
      <div className="mt-4">
        <form>
          <InputField
            name="companyContact"
            label="Nominal"
            labelclassName="font-medium"
            placeholder="Enter nominal"
            value={expenses?.nominal}
          />
          <fieldset className="space-y-1 gap-[6px]">
            <label htmlFor="" className="font-medium text-sm">
              Attachment Upload
            </label>
            <img
              src={`${baseUrl}/uploads/` + expenses?.attachment}
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
