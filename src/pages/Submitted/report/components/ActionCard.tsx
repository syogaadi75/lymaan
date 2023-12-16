import {Modal} from "components/ui";
import Button from "components/ui/buttons/Button";
import {useDisclosure} from "hooks";
import {useHistory} from "react-router-dom";

const ActionCard = ({
  onSave,
  onSave2,
}: {
  onSave: () => void;
  onSave2?: () => void;
}) => {
  const {
    isOpen: isOpenSave,
    onClose: onCloseSave,
    onOpen: onOpenSave,
  } = useDisclosure();
  const {
    isOpen: isOpenDiscard,
    onClose: onCloseDiscard,
    onOpen: onOpenDiscard,
  } = useDisclosure();

  const route = useHistory();
  const onDiscard = () => {
    onCloseDiscard();
    route.push("../");
  };

  return (
    <>
      <div className="w-full p-4 mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <Button size="large" onClick={() => onOpenSave()}>
            <span>Save</span>
          </Button>
          <Button size="large" color="outline" onClick={onOpenDiscard}>
            <span>Discard</span>
          </Button>
        </div>
      </div>
      <Modal
        isOpen={isOpenSave}
        onClose={onCloseSave}
        title="Save"
        footer={false}>
        <p className="text-xl text-center">
          Are you sure want to save changes?
        </p>
        <div className="flex justify-center gap-9 mt-10">
          <Button
            onClick={() => {
              onSave();
              if (onSave2) onSave2();
              onCloseSave();
            }}
            style={{padding: "1rem 2.5rem"}}>
            Save
          </Button>
          <Button
            color="outline"
            style={{padding: "1rem 2.5rem"}}
            onClick={() => onCloseSave()}>
            No
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={isOpenDiscard}
        onClose={onCloseDiscard}
        title="Discard"
        footer={false}>
        <p className="text-xl text-center">
          Are you sure want to discard changes?
        </p>
        <div className="flex justify-center gap-9 mt-10">
          <Button onClick={onDiscard} style={{padding: "1rem 2.5rem"}}>
            Discard
          </Button>
          <Button
            color="outline"
            style={{padding: "1rem 2.5rem"}}
            onClick={() => onCloseDiscard()}>
            No
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ActionCard;
