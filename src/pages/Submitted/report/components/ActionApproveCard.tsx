import {Modal} from "components/ui";
import Button from "components/ui/buttons/Button";
import {useDisclosure} from "hooks";
import {useApproveReport, useRejectReport} from "hooks/query";
import {ReportnameResponse} from "interfaces";
import {useQueryClient} from "react-query";
import {useHistory} from "react-router-dom";

const ActionApproveCard = ({
  dataReportname,
}: {
  dataReportname: ReportnameResponse;
}) => {
  const {
    isOpen: isOpenApproved,
    onClose: onCloseApproved,
    onOpen: onOpenApproved,
  } = useDisclosure();

  const {
    isOpen: isOpenReject,
    onClose: onCloseReject,
    onOpen: onOpenReject,
  } = useDisclosure();

  const queryClient = useQueryClient();
  const {mutate: approveReport} = useApproveReport(() => {
    queryClient.invalidateQueries("get-report-name");
  });

  const {mutate: rejectReport} = useRejectReport(() => {
    queryClient.invalidateQueries("get-report-name");
  });

  return (
    <>
      <div className="w-full p-4 mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <Button size="large" onClick={onOpenApproved}>
            <span>Approved Report</span>
          </Button>
          <Button size="large" color="outline" onClick={onOpenReject}>
            <span>Rejected</span>
          </Button>
        </div>
      </div>
      <Modal
        isOpen={isOpenApproved}
        onClose={onCloseApproved}
        title="Save"
        footer={false}>
        <p className="text-xl text-center">
          Are you sure want to approve this report?
        </p>
        <div className="flex justify-center gap-9 mt-10">
          <Button
            onClick={() => {
              approveReport(dataReportname.id);
              onCloseApproved();
            }}
            style={{padding: "1rem 2.5rem"}}>
            Approve
          </Button>
          <Button
            color="outline"
            style={{padding: "1rem 2.5rem"}}
            onClick={() => onCloseApproved()}>
            Cancel
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={isOpenReject}
        onClose={onCloseReject}
        title="Discard"
        footer={false}>
        <p className="text-xl text-center">
          Are you sure want to reject this report?
        </p>
        <div className="flex justify-center gap-9 mt-10">
          <Button
            onClick={() => {
              rejectReport(dataReportname.id);
              onCloseReject();
            }}
            style={{padding: "1rem 2.5rem"}}>
            Reject
          </Button>
          <Button
            color="outline"
            style={{padding: "1rem 2.5rem"}}
            onClick={onCloseReject}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ActionApproveCard;
