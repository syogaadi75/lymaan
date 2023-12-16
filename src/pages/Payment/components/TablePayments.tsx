import {ColumnsType} from "antd/es/table";
import cx from "classnames";
import {Modal} from "components/ui";
import Table, {paginationFromResponse} from "components/ui/Table";
import Button from "components/ui/buttons/Button";
import IconButton from "components/ui/buttons/IconButton";
import {useDisclosure} from "hooks";
import {
  useDeletePayment,
  useExportPaymentExcel,
  useExportPaymentPDF,
  useGetListPayments,
} from "hooks/query";
import {
  ApiListRequest,
  PaymentTypeApi,
  defaultApiListOptions,
} from "interfaces";
import {useState} from "react";

import {BiEdit} from "react-icons/bi";
import {BsPrinter, BsThreeDots} from "react-icons/bs";
import {FaFileExcel, FaFilePdf, FaRegTrashAlt} from "react-icons/fa";
import {useQueryClient} from "react-query";
import {useHistory} from "react-router";
import {formatDate, formatNumberPrefixZero} from "utils";

export interface DataTableType {
  id: number;
  company: {
    name: string;
  };
  invoice_number: string;
  inv_date: string;
  status: string | JSX.Element;
  action: React.ReactElement;
}

const ButtonsAction = ({
  paymentData,
  handleViewPayment,
  handleEditPayment,
  handleDeletePayment,
}: {
  paymentData: PaymentTypeApi;
  handleViewPayment: () => void;
  handleEditPayment: () => void;
  handleDeletePayment: (paymentData: PaymentTypeApi) => void;
}) => {
  return (
    <div className="flex gap-3">
      <IconButton tooltip="View" onClick={() => handleViewPayment()}>
        <BsThreeDots fontSize={24} />
      </IconButton>
      <IconButton tooltip="Print">
        <BsPrinter fontSize={24} />
      </IconButton>
      <IconButton tooltip="Edit" onClick={() => handleEditPayment()}>
        <BiEdit fontSize={24} />
      </IconButton>
      <IconButton
        tooltip="Delete"
        onClick={() => handleDeletePayment(paymentData)}>
        <FaRegTrashAlt fontSize={24} />
      </IconButton>
    </div>
  );
};

const column: ColumnsType<DataTableType> = [
  {
    title: "No",
    dataIndex: "no",
    render: (_, record, index) => index + 1,
  },
  {
    title: "Invoice Number",
    dataIndex: "invoice_number",
    sorter: {
      compare: (a, b) => a.id.toString().localeCompare(b.id.toString()),
    },
  },
  {
    title: "Insurer Name",
    dataIndex: ["company", "name"],
    sorter: {
      compare: (a, b) => a.company.name.localeCompare(b.company.name),
    },
  },
  {
    title: "Created Date",
    dataIndex: "inv_date",
    sorter: {
      compare: (a, b) => a.inv_date.localeCompare(b.inv_date),
    },
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

export const TablePayments = () => {
  const [deleteModalContent, setDeleteModalContent] =
    useState<PaymentTypeApi | null>(null);

  const {isOpen, onClose, onOpen} = useDisclosure();
  const {mutate: deletePayment, isLoading} = useDeletePayment();
  const queryClient = useQueryClient();

  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onOpen: onOpenExport,
  } = useDisclosure();

  const {mutate: exportPDF, isLoading: isLoadingExportPDF} =
    useExportPaymentPDF();
  const {mutate: exportExcel, isLoading: isLoadingExportExcel} =
    useExportPaymentExcel();

  const handleDelete = () => {
    if (deleteModalContent)
      deletePayment(deleteModalContent.id, {
        onSuccess: () => {
          queryClient.invalidateQueries("get-list-payments");
          onClose();
        },
      });
  };

  const {push} = useHistory();

  const [listOption, setListOption] = useState<ApiListRequest>(
    defaultApiListOptions,
  );

  const {
    data,
    isLoading: isLoadingGet,
    refetch,
  } = useGetListPayments(listOption);

  const dataSource: DataTableType[] =
    data?.data.map((data, index: number) => {
      return {
        key: index,
        id: index,
        invoice_number: formatNumberPrefixZero(data.id),
        company: {
          name: data.company?.name,
        },
        inv_date: formatDate(new Date(data.inv_date)),
        status: (
          <div
            className={cx("rounded-full w-fit px-4 py-2", {
              "bg-green-600 text-white":
                (data.status === "Donee" &&
                  data.status.replace(/Donee/gi, "Done")) ||
                data.status === "Done",
              "bg-blue-600 text-white": data.status === "Invoice",
              "bg-yellow-300 text-black": data.status === "Proforma",
            })}>
            {data.status === "Donee"
              ? data.status.replace(/Donee/gi, "Done")
              : data.status}
          </div>
        ),
        action: (
          <ButtonsAction
            paymentData={data}
            handleViewPayment={() => push(`payment/${data.id}`)}
            handleEditPayment={() => push(`payment/${data.id}/edit`)}
            handleDeletePayment={(paymentData) => {
              onOpen();
              setDeleteModalContent(paymentData);
            }}
          />
        ),
      };
    }) ?? [];

  return (
    <>
      <Table
        datePicker
        columns={column}
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
        onAddButton={() => push("/payment/add")}
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
        title="Delete Invoice"
        okText="Delete"
        okType="danger"
        okButtonProps={{onClick: handleDelete, loading: isLoading}}>
        <div className="flex flex-col gap-2 pb-3">
          <p>Are you sure you want to delete this invoice? :</p>
          <div>
            <label className="ml-2 font-semibold">Invoice Number</label>
            <p className="border border-black rounded-md px-2 py-1">
              {formatNumberPrefixZero(
                parseInt(deleteModalContent?.id.toString() ?? "0"),
              )}
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
