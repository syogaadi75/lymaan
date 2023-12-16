import {ReactComponent as DetailIcon} from "public/icons/dots-horizontal.svg";
import {ReactComponent as EditIcon} from "public/icons/edit-05.svg";
import {ReactComponent as DeleteIcon} from "public/icons/trash-01.svg";
import {
  useDeleteCase,
  useExportSubmitCaseExcel,
  useExportSubmitCasePDF,
  useGetListSubmitCase,
} from "hooks/query";
import {useHistory} from "react-router";
import {ApiListRequest, CaseResponse, defaultApiListOptions} from "interfaces";
import {useQueryClient} from "react-query";
import {ColumnsType} from "antd/es/table";
import Table, {
  MainColumnsType,
  paginationFromResponse,
} from "components/ui/Table";
import {useState} from "react";
import {Modal} from "components/ui";
import {formatDate, formatNumberPrefixZero} from "utils";
import {useDisclosure} from "hooks";
import {Link} from "react-router-dom";
import IconButton from "components/ui/buttons/IconButton";
import {useUser} from "hooks/atom/useAtom";
import cx from "classnames";
import Button from "components/ui/buttons/Button";
import {FaFileExcel, FaFilePdf} from "react-icons/fa";

export interface CaseColumnsType extends MainColumnsType, CaseResponse {
  case_number: string;
  progress: string;
  action: React.ReactElement;
}

const ActionButtons = ({
  submitcase,
  onDelete,
}: {
  submitcase: CaseResponse;
  onDelete: (submitcase: CaseResponse) => void;
}) => {
  const {user} = useUser();
  return (
    <div className="flex gap-2">
      <Link to={"/submitted-case/" + submitcase.id}>
        <IconButton tooltip="Detail">
          <DetailIcon />
        </IconButton>
      </Link>
      {["Admin", "Direktur"].includes(user?.roles ?? "") && (
        <>
          <Link to={"/submitted-case/" + submitcase.id + "/edit"}>
            <IconButton tooltip="Edit">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton tooltip="Delete" onClick={() => onDelete(submitcase)}>
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

const TableCases = ({isComplete}: {isComplete?: boolean}) => {
  const {user} = useUser();
  const [deleteModalContent, setDeleteModalContent] =
    useState<CaseResponse | null>(null);
  const {isOpen, onClose, onOpen} = useDisclosure();
  const {mutate: deleteCase, isLoading} = useDeleteCase();
  const {push} = useHistory();
  const queryClient = useQueryClient();

  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onOpen: onOpenExport,
  } = useDisclosure();

  const {mutate: exportPDF, isLoading: isLoadingExportPDF} =
    useExportSubmitCasePDF();
  const {mutate: exportExcel, isLoading: isLoadingExportExcel} =
    useExportSubmitCaseExcel();

  const handleDeleteUser = () => {
    if (deleteModalContent)
      deleteCase(deleteModalContent.id, {
        onSuccess: () => {
          queryClient.invalidateQueries("get-list-submitted-case");
          onClose();
        },
      });
  };

  const [listOption, setListOption] = useState<ApiListRequest>(
    defaultApiListOptions,
  );

  const {
    data,
    isLoading: isLoadingGet,
    refetch,
  } = useGetListSubmitCase(listOption);

  const columns: ColumnsType<CaseColumnsType> = [
    {
      title: "No",
      dataIndex: "no",
    },
    {
      title: "Case Number",
      dataIndex: "case_number",
      sorter: {
        compare: (a, b) => a.case_number.localeCompare(b.case_number),
      },
    },
    {
      title: "Company Name",
      dataIndex: ["company", "name"],
      sorter: {
        compare: (a, b) => a.company.name.localeCompare(b.company.name),
      },
    },
    {
      title: "Adjuster Name",
      dataIndex: "adjusters",
      render: (_, record) => <div>{record.adjusters[0].name}</div>,
    },
    {
      title: "RM",
      dataIndex: "RM",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          {record.reportnames.find(
            (report) => report.report_name === "Registration Module",
          )?.status === "Backlog" && (
            <div className="w-4 h-4 bg-gray-300"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Registration Module",
          )?.status === "Pending" && <div className="w-4 h-4 bg-red-500"></div>}
          {record.reportnames.find(
            (report) => report.report_name === "Registration Module",
          )?.status === "In Progress" && (
            <div className="w-4 h-4 bg-yellow-400"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Registration Module",
          )?.status === "In Review" && (
            <div className="w-4 h-4 bg-blue-500"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Registration Module",
          )?.status === "Rejected" && (
            <div className="w-4 h-4 bg-purple-600"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Registration Module",
          )?.status === "Done" && <div className="w-4 h-4 bg-green-500"></div>}
          {!record.reportnames.find(
            (report) => report.report_name === "Registration Module",
          )?.status && <>-</>}
        </div>
      ),
    },
    {
      title: "UM",
      dataIndex: "UM",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          {record.reportnames.find(
            (report) => report.report_name === "Updating Module",
          )?.status === "Backlog" && (
            <div className="w-4 h-4 bg-gray-300"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Updating Module",
          )?.status === "Pending" && <div className="w-4 h-4 bg-red-500"></div>}
          {record.reportnames.find(
            (report) => report.report_name === "Updating Module",
          )?.status === "In Progress" && (
            <div className="w-4 h-4 bg-yellow-400"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Updating Module",
          )?.status === "In Review" && (
            <div className="w-4 h-4 bg-blue-500"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Updating Module",
          )?.status === "Rejected" && (
            <div className="w-4 h-4 bg-purple-600"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Updating Module",
          )?.status === "Done" && <div className="w-4 h-4 bg-green-500"></div>}
          {!record.reportnames.find(
            (report) => report.report_name === "Updating Module",
          )?.status && <>-</>}
        </div>
      ),
    },
    {
      title: "FSR",
      dataIndex: "FSR",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          {record.reportnames.find(
            (report) => report.report_name === "First Survey Report",
          )?.status === "Backlog" && (
            <div className="w-4 h-4 bg-gray-300"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "First Survey Report",
          )?.status === "Pending" && <div className="w-4 h-4 bg-red-500"></div>}
          {record.reportnames.find(
            (report) => report.report_name === "First Survey Report",
          )?.status === "In Progress" && (
            <div className="w-4 h-4 bg-yellow-400"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "First Survey Report",
          )?.status === "In Review" && (
            <div className="w-4 h-4 bg-blue-500"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "First Survey Report",
          )?.status === "Rejected" && (
            <div className="w-4 h-4 bg-purple-600"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "First Survey Report",
          )?.status === "Done" && <div className="w-4 h-4 bg-green-500"></div>}
          {!record.reportnames.find(
            (report) => report.report_name === "First Survey Report",
          )?.status && <>-</>}
        </div>
      ),
    },
    {
      title: "PR",
      dataIndex: "PR",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          {record.reportnames.find(
            (report) => report.report_name === "Preliminary Report",
          )?.status === "Backlog" && (
            <div className="w-4 h-4 bg-gray-300"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Preliminary Report",
          )?.status === "Pending" && <div className="w-4 h-4 bg-red-500"></div>}
          {record.reportnames.find(
            (report) => report.report_name === "Preliminary Report",
          )?.status === "In Progress" && (
            <div className="w-4 h-4 bg-yellow-400"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Preliminary Report",
          )?.status === "In Review" && (
            <div className="w-4 h-4 bg-blue-500"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Preliminary Report",
          )?.status === "Rejected" && (
            <div className="w-4 h-4 bg-purple-600"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Preliminary Report",
          )?.status === "Done" && <div className="w-4 h-4 bg-green-500"></div>}
          {!record.reportnames.find(
            (report) => report.report_name === "Preliminary Report",
          )?.status && <>-</>}
        </div>
      ),
    },
    {
      title: "IR",
      dataIndex: "IR",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          {record.reportnames.find(
            (report) => report.report_name === "Interim Report",
          )?.status === "Backlog" && (
            <div className="w-4 h-4 bg-gray-300"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Interim Report",
          )?.status === "Pending" && <div className="w-4 h-4 bg-red-500"></div>}
          {record.reportnames.find(
            (report) => report.report_name === "Interim Report",
          )?.status === "In Progress" && (
            <div className="w-4 h-4 bg-yellow-400"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Interim Report",
          )?.status === "In Review" && (
            <div className="w-4 h-4 bg-blue-500"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Interim Report",
          )?.status === "Rejected" && (
            <div className="w-4 h-4 bg-purple-600"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Interim Report",
          )?.status === "Done" && <div className="w-4 h-4 bg-green-500"></div>}
          {!record.reportnames.find(
            (report) => report.report_name === "Interim Report",
          )?.status && <>-</>}
        </div>
      ),
    },
    {
      title: "DFR",
      dataIndex: "DFR",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final Report",
          )?.status === "Backlog" && (
            <div className="w-4 h-4 bg-gray-300"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final Report",
          )?.status === "Pending" && <div className="w-4 h-4 bg-red-500"></div>}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final Report",
          )?.status === "In Progress" && (
            <div className="w-4 h-4 bg-yellow-400"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final Report",
          )?.status === "In Review" && (
            <div className="w-4 h-4 bg-blue-500"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final Report",
          )?.status === "Rejected" && (
            <div className="w-4 h-4 bg-purple-600"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final Report",
          )?.status === "Done" && <div className="w-4 h-4 bg-green-500"></div>}
          {!record.reportnames.find(
            (report) => report.report_name === "Draft Final Report",
          )?.status && <>-</>}
        </div>
      ),
    },
    {
      title: "DFRR",
      dataIndex: "DFRR",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final Report Revision",
          )?.status === "Backlog" && (
            <div className="w-4 h-4 bg-gray-300"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final Report Revision",
          )?.status === "Pending" && <div className="w-4 h-4 bg-red-500"></div>}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final Report Revision",
          )?.status === "In Progress" && (
            <div className="w-4 h-4 bg-yellow-400"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final Report Revision",
          )?.status === "In Review" && (
            <div className="w-4 h-4 bg-blue-500"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final Report Revision",
          )?.status === "Rejected" && (
            <div className="w-4 h-4 bg-purple-600"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final Report Revision",
          )?.status === "Done" && <div className="w-4 h-4 bg-green-500"></div>}
          {!record.reportnames.find(
            (report) => report.report_name === "Draft Final Report Revision",
          )?.status && <>-</>}
        </div>
      ),
    },
    {
      title: "DFFR",
      dataIndex: "DFFR",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final and Final Report",
          )?.status === "Backlog" && (
            <div className="w-4 h-4 bg-gray-300"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final and Final Report",
          )?.status === "Pending" && <div className="w-4 h-4 bg-red-500"></div>}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final and Final Report",
          )?.status === "In Progress" && (
            <div className="w-4 h-4 bg-yellow-400"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final and Final Report",
          )?.status === "In Review" && (
            <div className="w-4 h-4 bg-blue-500"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final and Final Report",
          )?.status === "Rejected" && (
            <div className="w-4 h-4 bg-purple-600"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Draft Final and Final Report",
          )?.status === "Done" && <div className="w-4 h-4 bg-green-500"></div>}
          {!record.reportnames.find(
            (report) => report.report_name === "Draft Final and Final Report",
          )?.status && <>-</>}
        </div>
      ),
    },
    {
      title: "FR",
      dataIndex: "FR",
      render: (_, record) => (
        <div className="flex justify-center items-center">
          {record.reportnames.find(
            (report) => report.report_name === "Final Report",
          )?.status === "Backlog" && (
            <div className="w-4 h-4 bg-gray-300"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Final Report",
          )?.status === "Pending" && <div className="w-4 h-4 bg-red-500"></div>}
          {record.reportnames.find(
            (report) => report.report_name === "Final Report",
          )?.status === "In Progress" && (
            <div className="w-4 h-4 bg-yellow-400"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Final Report",
          )?.status === "In Review" && (
            <div className="w-4 h-4 bg-blue-500"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Final Report",
          )?.status === "Rejected" && (
            <div className="w-4 h-4 bg-purple-600"></div>
          )}
          {record.reportnames.find(
            (report) => report.report_name === "Final Report",
          )?.status === "Done" && <div className="w-4 h-4 bg-green-500"></div>}
          {!record.reportnames.find(
            (report) => report.report_name === "Final Report",
          )?.status && <>-</>}
        </div>
      ),
    },
    // {
    //   title: "Progress",
    //   dataIndex: "progress",
    //   sorter: {
    //     compare: (a, b) => a.progress.localeCompare(b.progress),
    //   },
    //   render: (_, record) => (
    //     <div
    //       className={cx("text-center rounded-lg py-1 font-medium", {
    //         "bg-red-500 text-white": record.progress.toLowerCase() == "pending",
    //         "bg-green-600 text-white":
    //           record.progress.toLowerCase() == "done" || isComplete,
    //         "bg-orange-400 text-white":
    //           !["pending", "done"].includes(record.progress.toLowerCase()) &&
    //           !isComplete,
    //       })}>
    //       {isComplete ? "Done" : record.progress}
    //     </div>
    //   ),
    // },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const dataSource: CaseColumnsType[] =
    data?.data
      .filter((item) =>
        !isComplete || isComplete == undefined
          ? !item.reportnames.find(
              (item2) =>
                item2.report_name == "Final Report" &&
                item2.status.toLowerCase() == "done",
            )
          : item.reportnames.find(
              (item2) =>
                item2.report_name == "Final Report" &&
                item2.status.toLowerCase() == "done",
            ),
      )
      .map(
        (data, index): CaseColumnsType => ({
          ...data,
          case_number: formatNumberPrefixZero(parseInt(data.id)),
          created_at: formatDate(new Date(data.created_at)),
          progress:
            data.reportnames.find(
              (item, index) =>
                index == data.reportnames.length - 1 ||
                item.status.toLowerCase() != "done",
            )?.report_name ?? "Pending",
          key: data.id,
          no: (listOption.page - 1) * listOption.per_page + (index + 1),
          action: (
            <ActionButtons
              submitcase={data}
              onDelete={(submitcase) => {
                onOpen();
                setDeleteModalContent(submitcase);
              }}
            />
          ),
        }),
      ) ?? [];

  return (
    <>
      <div className="flex flex-col gap-2 mt-4 w-full">
        <div>
          <strong className="text-gray-600">Informasi Warna</strong> berdasarkan
          status progressnya
        </div>
        <div className="flex gap-3 flex-wrap w-full">
          <div className="flex gap-1 items-center text-gray-500">
            <div className="w-4 h-4 bg-gray-300"></div> Backlog
          </div>
          <div className="flex gap-1 items-center text-gray-500">
            <div className="w-4 h-4 bg-red-500"></div> Pending
          </div>
          <div className="flex gap-1 items-center text-gray-500">
            <div className="w-4 h-4 bg-yellow-400"></div> In Progress
          </div>
          <div className="flex gap-1 items-center text-gray-500">
            <div className="w-4 h-4 bg-blue-500"></div> In Review
          </div>
          <div className="flex gap-1 items-center text-gray-500">
            <div className="w-4 h-4 bg-purple-600"></div> Rejected
          </div>
          <div className="flex gap-1 items-center text-gray-500">
            <div className="w-4 h-4 bg-green-500"></div> Done
          </div>
        </div>
      </div>
      <Table
        datePicker
        columns={columns}
        dataSource={dataSource}
        loading={isLoadingGet}
        pagination={paginationFromResponse(data)}
        onChangePagination={(page, pageSize) =>
          setListOption({
            page: page,
            per_page: pageSize,
            search: listOption.search,
          })
        }
        onAddButton={
          ["Admin", "Direktur"].includes(user?.roles ?? "")
            ? () => push("/submitted-case/add")
            : undefined
        }
        onPrintButton={onOpenExport}
        onExportButton={onOpenExport}
        onReloadButton={refetch}
        onChangeSearch={(value) =>
          setListOption({
            page: 1,
            search: value,
            per_page: listOption.per_page,
          })
        }
        title="Case"
      />
      <Modal
        isOpen={isOpen}
        onClose={() => onClose()}
        title="Delete Case"
        okText="Delete"
        okType="danger"
        okButtonProps={{onClick: handleDeleteUser, loading: isLoading}}>
        <div className="flex flex-col gap-2 pb-3">
          <p>Are you sure you want to delete this case? :</p>
          <div>
            <label className="ml-2 font-semibold">Case Number</label>
            <p className="border border-black rounded-md px-2 py-1">
              {formatNumberPrefixZero(parseInt(deleteModalContent?.id ?? "0"))}
            </p>
          </div>
          <div>
            <label className="ml-2 font-semibold">Insurer</label>
            <p className="border border-black rounded-md px-2 py-1">
              {deleteModalContent?.company?.name}
            </p>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isOpenExport}
        onClose={() => onCloseExport()}
        footer={false}
        title="Export">
        <div className="mt-6 flex flex-col gap-2 pb-3">
          <Button
            onClick={() => exportPDF()}
            loading={isLoadingExportPDF}
            icon={<FaFilePdf />}>
            PDF
          </Button>
          <Button
            onClick={() => exportExcel()}
            loading={isLoadingExportExcel}
            icon={<FaFileExcel />}>
            EXCEL
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TableCases;
