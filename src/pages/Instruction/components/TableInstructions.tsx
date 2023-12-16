import {ReactComponent as EditUserIcon} from "public/icons/edit-05.svg";
import {ReactComponent as DeleteUserIcon} from "public/icons/trash-01.svg";
import {useHistory} from "react-router";
import {
  ApiListRequest,
  InstructionResponse,
  defaultApiListOptions,
} from "interfaces";
import {useQueryClient} from "react-query";
import {ColumnsType} from "antd/es/table";
import Table, {
  MainColumnsType,
  paginationFromResponse,
} from "components/ui/Table";
import {useState} from "react";
import {Modal} from "components/ui";
import {formatDate} from "utils";
import {useDisclosure} from "hooks";
import IconButton from "components/ui/buttons/IconButton";
import Button from "components/ui/buttons/Button";
import {FaFileExcel, FaFilePdf} from "react-icons/fa";
import {
  useDeleteInstruction,
  useExportInstructionExcel,
  useExportInstructionPDF,
  useGetListInstructions,
} from "hooks/query";

interface InstructionColumnsType extends MainColumnsType, InstructionResponse {
  created_at_str: string;
  status: string;
  action: React.ReactElement;
}

const columns: ColumnsType<InstructionColumnsType> = [
  {
    title: "No",
    dataIndex: "no",
  },
  {
    title: "Created Date",
    dataIndex: "created_at_str",
    sorter: {
      compare: (a, b) => a.created_at_str.localeCompare(b.created_at_str),
    },
  },
  {
    title: "Assigned To",
    dataIndex: ["role", "name"],
    sorter: {
      compare: (a, b) =>
        a.assigned_to.toString().localeCompare(b.role.name.toString()),
    },
  },
  {
    title: "Company",
    dataIndex: "company_name",
    sorter: {
      compare: (a, b) =>
        a.assigned_to.toString().localeCompare(b.company_name.toString()),
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    sorter: {
      compare: (a, b) => a.description.localeCompare(b.description),
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    sorter: {
      compare: (a, b) => a.status.localeCompare(b.status),
    },
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

export const ActionButtons = ({
  instruction,
  onOpen,
  setDeleteModalContent,
}: {
  instruction: InstructionResponse;
  onOpen: () => void;
  setDeleteModalContent: (val: InstructionResponse) => void;
}) => {
  const {push} = useHistory();

  const handleOpenDeleteModal = () => {
    setDeleteModalContent(instruction);
    onOpen();
  };

  return (
    <div className="flex gap-2">
      <IconButton
        tooltip="Edit"
        onClick={() => push(`/instruction/${instruction.id}/edit`)}>
        <EditUserIcon />
      </IconButton>
      <IconButton tooltip="Delete" onClick={handleOpenDeleteModal}>
        <DeleteUserIcon />
      </IconButton>
    </div>
  );
};

const TableInstructions = () => {
  const [deleteModalContent, setDeleteModalContent] =
    useState<InstructionResponse | null>(null);
  const {isOpen, onClose, onOpen} = useDisclosure();
  const {mutate: deleteInstruction, isLoading} = useDeleteInstruction();

  const {
    isOpen: isOpenExport,
    onClose: onCloseExport,
    onOpen: onOpenExport,
  } = useDisclosure();

  const {mutate: exportPDF, isLoading: isLoadingExportPDF} =
    useExportInstructionPDF();
  const {mutate: exportExcel, isLoading: isLoadingExportExcel} =
    useExportInstructionExcel();

  const {push} = useHistory();
  const queryClient = useQueryClient();

  const handleDeleteInstruction = () => {
    if (deleteModalContent) {
      deleteInstruction(deleteModalContent.id.toString(), {
        onSuccess: () => {
          queryClient.invalidateQueries("get-instructions");
          onClose();
        },
      });
    }
  };

  const [listOption, setListOption] = useState<ApiListRequest>(
    defaultApiListOptions,
  );

  const {
    data,
    isLoading: isLoadingGet,
    refetch,
  } = useGetListInstructions(listOption);

  const dataSource: InstructionColumnsType[] =
    data?.data?.map(
      (data, index): InstructionColumnsType => ({
        ...data,
        created_at_str: formatDate(new Date(data.created_at)),
        key: data.id,
        no: (listOption.page - 1) * listOption.per_page + (index + 1),
        action: (
          <ActionButtons
            instruction={data}
            onOpen={onOpen}
            setDeleteModalContent={setDeleteModalContent}
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
        onAddButton={() => push("/instruction/add")}
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
        title="Instruction"
      />
      <Modal
        isOpen={isOpen}
        onClose={() => onClose()}
        title="Delete Instruction"
        okText="Delete"
        okType="danger"
        okButtonProps={{onClick: handleDeleteInstruction, loading: isLoading}}>
        <div className="flex flex-col gap-2 pb-3">
          <p>Are you sure you want to delete this instruction? :</p>
          <div>
            <label className="ml-2 font-semibold">Insurer Name</label>
            <p className="border border-black rounded-md px-2 py-1">
              {deleteModalContent?.company_name}
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

export default TableInstructions;
