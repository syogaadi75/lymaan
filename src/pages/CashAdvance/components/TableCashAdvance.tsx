import {ColumnsType} from "antd/es/table";
import {
  useExportCashAdvanceExcel,
  useExportCashAdvancePDF,
  useExportExpensesExcel,
  useExportExpensesPDF,
  useGetListSubmitCase,
} from "hooks/query";
import {ApiListRequest, CaseResponse, defaultApiListOptions} from "interfaces";
import React, {useState} from "react";
import {Link} from "react-router-dom";
// icons
import {ReactComponent as DetailIcon} from "public/icons/dots-horizontal.svg";
import {ReactComponent as CreditCardIcon} from "public/icons/credit-card-edit.svg";
import {ReactComponent as InfoIcon} from "public/icons/info-square.svg";
import {ReactComponent as EditIcon} from "public/icons/edit-05.svg";
import {ReactComponent as PrintIcon} from "public/icons/printer.svg";
import IconButton from "components/ui/buttons/IconButton";
import {formatDate, formatNumberPrefixZero} from "utils";
import Table, {paginationFromResponse} from "components/ui/Table";
import {useUser} from "hooks/atom/useAtom";
import Button from "components/ui/buttons/Button";
import {FaFileExcel, FaFilePdf} from "react-icons/fa";
import {useDisclosure} from "hooks";
import {Modal} from "components/ui";
import {Typography} from "antd";

export interface ColumnDataType extends CaseResponse {
  case_number: string;
  key: React.Key;
  no: React.Key;
  action: React.ReactElement;
}

const ActionButtons = ({id}: {id: string}) => {
  const {user} = useUser();
  return (
    <div className="flex gap-2">
      <IconButton tooltip="Detail">
        <DetailIcon />
      </IconButton>
      {["Keuangan", "Admin", "Sekretaris", "Direktur"].includes(
        user?.roles ?? "",
      ) && (
        <IconButton tooltip="Click to done" color="warning">
          <InfoIcon />
        </IconButton>
      )}
      <IconButton tooltip="Print">
        <PrintIcon />
      </IconButton>
      {["Adjuster"].includes(user?.roles ?? "") && (
        <Link to={"/submitted-case/" + id + "/expenses"}>
          <IconButton tooltip="Edit">
            <EditIcon />
          </IconButton>
        </Link>
      )}
      {["Keuangan", "Admin", "Sekretaris", "Direktur"].includes(
        user?.roles ?? "",
      ) && (
        <>
          <Link to={"/cash-advance/expenses/" + id}>
            <IconButton tooltip="Expenses">
              <CreditCardIcon />
            </IconButton>
          </Link>
          <Link to={"/cash-advance/cash/" + id}>
            <IconButton tooltip="Cash Advances">
              <EditIcon />
            </IconButton>
          </Link>
        </>
      )}
    </div>
  );
};

const columns: ColumnsType<ColumnDataType> = [
  {
    title: "No",
    dataIndex: "no",
    render: (index) => index + 1,
  },
  {
    title: "Case Number",
    dataIndex: ["case_number"],
    sorter: {
      compare: (a, b) => a.case_number.localeCompare(b.case_number),
    },
  },
  {
    title: "Insurer Name",
    dataIndex: ["company", "name"],
  },
  {
    title: "Created Date",
    dataIndex: "created_at",
    sorter: {
      compare: (a, b) =>
        new Date(a.created_at)
          .toString()
          .localeCompare(new Date(b.created_at).toString()),
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    render: () => (
      <div className="bg-[#FAFAE1] p-1 rounded-lg text-[#BE9A31] text-center">
        In Progress
      </div>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

export default function TableCashAdvance() {
  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onOpen: onOpenExport,
  } = useDisclosure();

  const {mutate: exportPDF, isLoading: isLoadingExportPDF} =
    useExportCashAdvancePDF();
  const {mutate: exportExcel, isLoading: isLoadingExportExcel} =
    useExportCashAdvanceExcel();

  const {mutate: exportExpensesPDF, isLoading: isLoadingExportExpensesPDF} =
    useExportExpensesPDF();
  const {mutate: exportExpensesExcel, isLoading: isLoadingExportExpensesExcel} =
    useExportExpensesExcel();

  const [listOption, setListOption] = useState<ApiListRequest>(
    defaultApiListOptions,
  );

  const {
    data,
    isLoading: isLoadingGet,
    refetch,
  } = useGetListSubmitCase(listOption);

  const dataSource: ColumnDataType[] =
    data?.data.map(
      (_data, index): ColumnDataType => ({
        ..._data,
        key: _data.id,
        no: index,
        case_number: formatNumberPrefixZero(parseInt(_data.id)),
        created_at: formatDate(new Date(_data.created_at)),
        action: <ActionButtons id={_data.id} />,
      }),
    ) ?? [];

  return (
    <>
      <Table
        datePicker
        columns={columns}
        dataSource={dataSource}
        loading={isLoadingGet}
        pagination={paginationFromResponse(data)}
        onReloadButton={refetch}
        onExportButton={onOpenExport}
        onChangePagination={(page, pageSize) =>
          setListOption({
            page: page,
            per_page: pageSize,
            search: listOption.search,
          })
        }
        onChangeSearch={(value) =>
          setListOption({
            page: 1,
            search: value,
            per_page: listOption.per_page,
          })
        }
        title="Cash Advances"
      />
      <Modal
        isOpen={isOpenExport}
        onClose={() => onCloseExport()}
        footer={false}
        title="Export">
        <div className="mt-6 flex flex-col gap-2 pb-3">
          <Typography.Title level={5} className="mb-0">
            Cash Advance
          </Typography.Title>
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
          <Typography.Title level={5} className="mb-0">
            Expenses
          </Typography.Title>
          <Button
            onClick={() => exportExpensesPDF()}
            loading={isLoadingExportExpensesPDF}
            icon={<FaFilePdf />}>
            PDF
          </Button>
          <Button
            onClick={() => exportExpensesExcel()}
            loading={isLoadingExportExpensesExcel}
            icon={<FaFileExcel />}>
            EXCEL
          </Button>{" "}
        </div>
      </Modal>
    </>
  );
}
