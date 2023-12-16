import {Button, message} from "antd";
import cx from "classnames";
import {ReactComponent as DetailIcon} from "public/icons/dots-horizontal.svg";
import {ReactComponent as EditIcon} from "public/icons/edit-05.svg";
import {ReactComponent as DeleteIcon} from "public/icons/trash-01.svg";
import {ReactComponent as PrintIcon} from "public/icons/printer.svg";
import {
  useCreateReportname,
  useDeleteReportname,
  useGetCaseReportNames,
} from "hooks/query";
import {
  ApiListRequest,
  ReportnameResponse,
  ReportnameSchema,
  ReportnameType,
  StatusesCase,
  UserType,
  bgColorLabelStatus,
  defaultApiListOptions,
} from "interfaces";
import {ColumnsType} from "antd/es/table";
import Table, {
  MainColumnsType,
  paginationFromResponse,
} from "components/ui/Table";
import {useState} from "react";
import {Modal} from "components/ui";
import {useDisclosure} from "hooks";
import {Link} from "react-router-dom";
import {InputField} from "components/hookform";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {formatDate} from "utils";
import IconButton from "components/ui/buttons/IconButton";

export interface ReportnameColumnsType
  extends MainColumnsType,
    ReportnameResponse {
  status: string;
  action: React.ReactElement;
}

export const columns: ColumnsType<ReportnameColumnsType> = [
  {
    title: "No",
    dataIndex: "no",
  },
  {
    title: "Report Name",
    dataIndex: "report_name",
    sorter: {
      compare: (a, b) => a.report_name.localeCompare(b.report_name),
    },
  },
  {
    title: "Last Edit",
    dataIndex: "updated_at",
    sorter: {
      compare: (a, b) => a.updated_at.localeCompare(b.updated_at),
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    sorter: {
      compare: (a, b) => a.status.localeCompare(b.status),
    },
    render: (_, record) => (
      <div
        className={cx(
          "text-center rounded-lg py-1 font-medium",
          bgColorLabelStatus[
            (record.status?.toLowerCase() ?? "") as StatusesCase
          ],
        )}>
        {record.status}
      </div>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const ActionButtons = ({
  data,
  onDelete,
}: {
  data: ReportnameResponse;
  onDelete: () => void;
}) => {
  return (
    <div className="flex gap-2">
      <Link to={"/submitted-case/" + data.case_id + "/report/" + data.id}>
        <IconButton tooltip="Detail">
          <DetailIcon />
        </IconButton>
      </Link>
      <IconButton tooltip="Print">
        <PrintIcon />
      </IconButton>
      <IconButton tooltip="Edit">
        <EditIcon />
      </IconButton>
      <IconButton tooltip="Delete" onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

const reportnameList = [
  "Registration Module",
  "Updating Module",
  "First Survey Report",
  "Preliminary Report",
  "Interim Report",
  "Draft Final Report",
  "Draft Final Report Revision",
  "Draft Final and Final Report",
  "Final Report",
];

type TableReportsProps = {
  id: string;
};

const TableReports = ({id}: TableReportsProps) => {
  const [deleteModalContent, setDeleteModalContent] = useState<UserType>({});

  // Table

  const [listOption, setListOption] = useState<ApiListRequest>(
    defaultApiListOptions,
  );

  const {data, isLoading: isLoadingGet, refetch} = useGetCaseReportNames(id);

  // Create
  const {isOpen, onClose, onOpen} = useDisclosure();
  const {mutate: createReportName, isLoading: isLoadingCreateReportName} =
    useCreateReportname();
  const [selectReportname, setSelectReportname] = useState("");

  const {register, handleSubmit, setError, formState, reset, resetField} =
    useForm({
      resolver: yupResolver(ReportnameSchema),
      defaultValues: {
        report_name: "",
        case_id: id,
        status: "Pending",
      },
    });

  const onSubmit: SubmitHandler<ReportnameType> = (submittedData) => {
    if (submittedData.report_name == "Registration Module")
      submittedData.status = "Done";
    if (submittedData.report_name == "Updating Module")
      submittedData.status = "In Progress";
    createReportName(submittedData, {
      onSuccess: () => {
        message.success("Success Create Report");
        onClose();
        refetch();
        reset({
          report_name: "",
          case_id: id,
          status: "Pending",
        });
        setSelectReportname("");
      },
      onError: () => {
        setError("report_name", {
          type: "errorResponse",
          message: "Something went wrong!. Please try again.",
        });
      },
    });
  };

  // Delete
  const {
    isOpen: isOpenDeleteModal,
    onClose: onCloseDeleteModal,
    onOpen: onOpenDeleteModal,
  } = useDisclosure();

  const {mutate: deleteReportName, isLoading: isLoadingDeleteReportName} =
    useDeleteReportname();

  const handleDeleteReportname = () => {
    deleteReportName(deleteModalContent?.id, {
      onSuccess: () => {
        onCloseDeleteModal();
        refetch();
      },
      onError: (data) => {
        alert(JSON.stringify(data));
      },
    });
  };

  const dataSource: ReportnameColumnsType[] =
    data?.data?.map(
      (data, index): ReportnameColumnsType => ({
        ...data,
        key: data.id,
        no: (listOption.page - 1) * listOption.per_page + (index + 1),
        updated_at: formatDate(new Date(data.updated_at)),
        action: (
          <ActionButtons
            data={data}
            onDelete={() => {
              onOpenDeleteModal();
              setDeleteModalContent(data);
            }}
          />
        ),
      }),
    ) ?? [];

  return (
    <>
      <Table
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
        onAddButton={onOpen}
        onPrintButton={onOpen}
        onExportButton={onOpen}
        onReloadButton={refetch}
        onChangeSearch={(value) =>
          setListOption({
            page: 1,
            search: value,
            per_page: listOption.per_page,
          })
        }
        title="Report"
      />
      <Modal isOpen={isOpen} onClose={onClose} title="Add Report" footer={null}>
        <div className="mt-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="flex flex-col space-y-1 gap-[6px]">
              <label htmlFor="role" className="font-medium text-sm">
                Name Report <span className="text-red-500"> &#42; </span>
              </label>
              <select
                value={selectReportname}
                onChange={(e) => {
                  setSelectReportname(e.target.value);
                  resetField("report_name", {
                    defaultValue:
                      e.target.value == "other" ? "" : e.target.value,
                  });
                }}
                className="border border-solid border-[#d6d6d6] rounded-md py-2 px-2 transition-colors hover:border-[#40a9ff] focus:outline-[#40a9ff] focus:border-[#40a9ff] focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]"
                defaultValue="">
                <option value="" disabled>
                  Select Report
                </option>
                {reportnameList.map((reportName, index) => (
                  <option
                    className={cx({
                      hidden: dataSource.find(
                        (_data) => _data.report_name == reportName,
                      ),
                    })}
                    value={reportName}
                    key={index}>
                    {reportName}
                  </option>
                ))}
                <option disabled style={{fontSize: "0.25em"}}></option>
                <option
                  disabled
                  style={{background: "#c9c9c9", fontSize: "0.1px"}}></option>
                <option disabled style={{fontSize: "0.25em"}}></option>
                <option value="other">Other Report</option>
              </select>
              <InputField
                className={cx({
                  hidden: selectReportname != "other",
                })}
                register={register}
                errors={formState.errors}
                name="report_name"
                label="Other Name"
                labelclassName={cx("font-medium", {
                  hidden: selectReportname != "other",
                })}
                placeholder="Enter Report Name"
              />
            </fieldset>

            <div className="flex justify-end mt-8 space-x-4">
              <Button
                htmlType="button"
                type="default"
                onClick={onClose}
                className="bg-primary-300 text-base h-fit text-white hover:!text-white font-medium px-3 py-2 flex items-center justify-center">
                Cancel
              </Button>
              <Button
                loading={isLoadingCreateReportName}
                htmlType="submit"
                type="default"
                className="bg-primary-400 text-base h-fit text-white hover:!text-white font-medium px-3 py-2 flex items-center justify-center">
                Add Report
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={isOpenDeleteModal}
        onClose={onCloseDeleteModal}
        title="Delete Report"
        okText="Delete"
        okType="danger"
        okButtonProps={{
          onClick: handleDeleteReportname,
          loading: isLoadingDeleteReportName,
        }}>
        <div className="flex flex-col gap-2 pb-3">
          <p>Are you sure you want to delete this Report Name? :</p>
          <div>
            <label className="ml-2 font-semibold">Name</label>
            <p className="border border-black rounded-md px-2 py-1">
              {deleteModalContent.report_name}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TableReports;
