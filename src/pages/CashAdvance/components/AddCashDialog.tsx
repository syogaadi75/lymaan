import {Button} from "antd";
import {Modal} from "components/ui";

type AddCashDialogProps = {
  isOpen: boolean;
  toggle: () => void;
};

function AddCashDialog({isOpen, toggle}: AddCashDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={toggle} title="Add Cash" footer={null}>
      <div className="mt-4">
        <form>
          <div className="flex justify-end mt-8 space-x-4">
            <Button
              htmlType="button"
              type="default"
              onClick={toggle}
              className="bg-primary-300 text-base h-fit text-white hover:!text-white font-medium px-3 py-2 flex items-center justify-center">
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="default"
              className="bg-primary-400 text-base h-fit text-white hover:!text-white font-medium px-3 py-2 flex items-center justify-center">
              Add Cash
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddCashDialog;
