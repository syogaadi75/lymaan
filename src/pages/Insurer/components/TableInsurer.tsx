import {Button, Divider, Modal, Space} from "antd";
import {ColumnsType} from "antd/es/table";
import Table, {paginationFromResponse} from "components/ui/Table";
import IconButton from "components/ui/buttons/IconButton";
import {useDisclosure} from "hooks";
import {useNotification} from "hooks/atom/useAtom";
import {
  useDeleteCompany,
  useExportCompanyExcel,
  useExportCompanyPDF,
} from "hooks/query";
import {ApiListRequest, ApiListResponse, InsurerData} from "interfaces";
import React, {useState} from "react";
import {BiEdit, BiTrash} from "react-icons/bi";
import {BsThreeDots} from "react-icons/bs";
import {FaFileExcel, FaFilePdf} from "react-icons/fa";
import {IoWarning} from "react-icons/io5";
import {useHistory} from "react-router";

interface InsurerDataTable extends InsurerData {
  key: React.Key;
  actions: React.ReactElement;
}

type TableInsurerType = {
  isDataLoading: boolean;
  listOption: ApiListRequest;
  data: ApiListResponse<InsurerData> | undefined;
  setListOption: (listOption: ApiListRequest) => void;
  refetch: () => void;
};

const TableInsurer = ({
  data,
  listOption,
  isDataLoading,
  setListOption,
  refetch,
}: TableInsurerType) => {
  const {push} = useHistory();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {setNotification: setNotifMsg} = useNotification();
  const [insurerId, setInsurerId] = useState<number>(0);
  const [filterData, setFilterData] = useState<InsurerData[]>([]);
  const [isModalView, setIsModalView] = useState<boolean>(false);
  const [isExportModal, setIsExportModal] = useState<boolean>(false);
  const [isModalDelete, setIsModalDelete] = useState<boolean>(false);

  const {mutate: deleteInsurer, isLoading: isLoadingDelete} =
    useDeleteCompany();
  const {mutate: exportCompanyPDF, isLoading: isLoadingExportPDF} =
    useExportCompanyPDF();
  const {mutate: exportCompanyExcel, isLoading: isLoadingExportExcel} =
    useExportCompanyExcel();

  const openDeleteModal = (id: number) => {
    onOpen();
    setInsurerId(id);
    setIsModalDelete(true);
  };

  const closeDeleteModal = () => {
    onClose();
    setIsModalDelete(false);
  };

  const openExportModal = () => {
    onOpen();
    setIsExportModal(true);
  };

  const closeExportModal = () => {
    onClose();
    setIsExportModal(false);
  };

  const handleCloseView = () => {
    onClose();
    setIsModalView(false);
    setFilterData([]);
  };

  const showDataById = (id: number) => {
    onOpen();
    setIsModalView(true);
    if (data) {
      const filteredData = data?.data.filter((data) => data.id === id);
      setFilterData(filteredData);
    }
  };

  const handleDeleteInsurer = (id: number) => {
    deleteInsurer(id, {
      onSuccess: () => {
        refetch();
        setNotifMsg({
          notificationType: "success",
          notificationTitle: "Success delete insurer",
          notificationDescription: "Insurer deleted successfully!",
        });
        onClose();
      },
      onError(error: any) {
        setNotifMsg({
          notificationType: "error",
          notificationTitle: "Error delete insurer",
          notificationDescription: error.message,
        });
        onClose();
      },
    });
  };

  const openEditInsurer = (insurerId: number) =>
    push(`/insurer/edit/${insurerId}`);

  const column: ColumnsType<InsurerDataTable> = [
    {
      title: "No",
      dataIndex: "no",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Insurer Name",
      dataIndex: "name",
      sorter: {compare: (a, b) => a.name.localeCompare(b.name)},
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
      },
    },
    {
      title: "Person In Charge",
      dataIndex: "person_incharge",
      sorter: {
        compare: (a, b) => a.person_incharge.localeCompare(b.person_incharge),
      },
    },
    {title: "Action", dataIndex: "actions"},
  ];

  const dataSource: InsurerDataTable[] =
    data?.data.map((_data, index) => ({
      ..._data,
      key: index,
      no: index,
      progress: "FRS",
      actions: (
        <Space>
          <IconButton tooltip="View" onClick={() => showDataById(_data.id)}>
            <BsThreeDots size={24} />
          </IconButton>
          <IconButton tooltip="Edit" onClick={() => openEditInsurer(_data.id)}>
            <BiEdit size={24} />
          </IconButton>
          <IconButton
            tooltip="Delete"
            onClick={() => openDeleteModal(_data.id)}>
            <BiTrash size={24} />
          </IconButton>
        </Space>
      ),
    })) ?? [];

  return (
    <>
      <Table
        datePicker
        title="Insurer"
        dataSource={dataSource}
        columns={column}
        loading={isDataLoading}
        pagination={paginationFromResponse(data)}
        onReloadButton={refetch}
        onAddButton={() => push("/insurer/add")}
        onImportButton={() => push("/insurer/import")}
        onExportButton={openExportModal}
        onPrintButton={openExportModal}
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
            per_page: listOption.per_page,
            search: value,
          })
        }
      />
      <Modal
        title={
          <>
            <h1 className="text-xl font-semibold" style={{marginBottom: 0}}>
              {isModalDelete && "Delete Insurer"}
              {isExportModal && "Export / Print Insurer"}
              {isModalView && "Detail Database Insurer"}
            </h1>
            <Divider style={{marginTop: 14}} />
          </>
        }
        width={600}
        open={isOpen}
        onCancel={
          isExportModal
            ? closeExportModal
            : isModalDelete
            ? closeDeleteModal
            : handleCloseView
        }
        footer={null}>
        {isModalView && filterData
          ? filterData.map((data, index) => (
              <ul key={index}>
                <li className="flex gap-[59px]">
                  Insurer Name <span>: &nbsp;&nbsp;{data.name}</span>
                </li>
                <li className="flex gap-11">
                  Insurer Address
                  <span>: &nbsp;&nbsp;{data.address}</span>
                </li>
                <li className="flex gap-11">
                  Insurer Contact
                  <span>: &nbsp;&nbsp;{data.phone}</span>
                </li>
                <li className="flex gap-8">
                  Person in Charge{" "}
                  <span>: &nbsp;&nbsp;{data.person_incharge}</span>
                </li>
                <li className="flex gap-[54px]">
                  Email Address <span>: &nbsp;&nbsp;{data.email}</span>
                </li>
                <li className="flex gap-12">
                  Phone Number <span>: &nbsp;&nbsp;{data.phone}</span>
                </li>
                <li className="flex gap-11">
                  Insurer Website
                  <span>: &nbsp;&nbsp;{data.website}</span>
                </li>
              </ul>
            ))
          : null}
        {isModalDelete && (
          <>
            <div className="mb-7 flex flex-col items-center gap-3">
              <IoWarning size={74} className="text-red-500" />
              <span className="space-y-2 text-center">
                <h1 className="text-center text-[20px] font-semibold text-red-600">
                  Are you sure wanna delete this Insurer?
                </h1>
                <p className="text-[16px] px-24">
                  You cannot undo this action and the data will be erased from
                  database!
                </p>
              </span>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                type="ghost"
                size="large"
                onClick={closeDeleteModal}
                className="border-red-600 text-red-500">
                Cancel
              </Button>
              <Button
                type="ghost"
                size="large"
                onClick={() => handleDeleteInsurer(insurerId)}
                className="bg-red-600 text-white">
                Delete Broker
              </Button>
            </div>
          </>
        )}
        {isExportModal && (
          <div className="flex flex-col gap-3">
            <Button
              type="ghost"
              size="large"
              icon={<FaFilePdf />}
              loading={isLoadingExportPDF}
              onClick={() => exportCompanyPDF()}
              className="bg-primary-500 text-white flex items-center justify-center text-lg">
              PDF
            </Button>
            <Button
              type="ghost"
              size="large"
              icon={<FaFileExcel />}
              loading={isLoadingExportExcel}
              onClick={() => exportCompanyExcel()}
              className="bg-primary-500 text-white flex items-center justify-center text-lg">
              Excel
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TableInsurer;
