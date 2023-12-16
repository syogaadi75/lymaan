import {useHistory} from "react-router";
import Table, {paginationFromResponse} from "components/ui/Table";
import {ColumnsType} from "antd/es/table";
import {
  ApiListRequest,
  VendorData,
  VendorTableType,
  defaultApiListOptions,
} from "interfaces";
import {useState} from "react";
import {
  useGetListVendor,
  useExportVendorPDF,
  useExportVendorExcel,
  useDeleteVendor,
} from "hooks/query";
import {useDisclosure} from "hooks";
import {Button, Divider, Modal, Space} from "antd";
import IconButton from "components/ui/buttons/IconButton";
import {BsThreeDots, BsTrash} from "react-icons/bs";
import {BiEdit} from "react-icons/bi";
import {FaFileExcel, FaFilePdf} from "react-icons/fa";
import {IoWarning} from "react-icons/io5";
import {useNotification} from "hooks/atom/useAtom";

const InsuredLists = () => {
  const {push} = useHistory();
  const {onOpen, onClose, isOpen} = useDisclosure();
  const [vendorId, setVendorId] = useState<number>(0);
  const {setNotification: setNotifMsg} = useNotification();
  const [isOpenedExport, setIsOpenedExport] = useState<boolean>(false);
  const [isOpenedDelete, setIsOpenedDelete] = useState<boolean>(false);
  const [filteredVendor, setFilteredVendor] = useState<VendorData[]>([]);
  const [listOption, setListOption] = useState<ApiListRequest>(
    defaultApiListOptions,
  );

  // START - query and mutation insureds
  const {data, isLoading, refetch} = useGetListVendor(listOption);
  const {mutate: deleteVendor, isLoading: isLoadingDeleteVendor} =
    useDeleteVendor();
  const {mutate: exportVendorPDF, isLoading: isLoadingExportPDF} =
    useExportVendorPDF();
  const {mutate: exportVendorExcel, isLoading: isLoadingExportExcel} =
    useExportVendorExcel();
  // END - query and mutation insureds

  // START - open and close modal view, export, and delete warning handler
  const openViewInsured = (insuredId: number) => {
    if (insuredId && data) {
      onOpen();
      const filteredVendor = data.data.filter((data) => data.id === insuredId);
      setFilteredVendor(filteredVendor);
    }
  };

  const openModalDelete = (id: number) => {
    onOpen();
    setVendorId(id);
    setIsOpenedDelete(true);
  };

  const openModalExport = () => {
    onOpen();
    setIsOpenedExport(true);
  };

  const closeViewInsured = () => {
    onClose();
    setFilteredVendor([]);
  };

  const closeModalDelete = () => {
    onClose();
    setVendorId(0);
    setIsOpenedDelete(false);
  };

  const cancelModalExport = () => {
    onClose();
    setIsOpenedExport(false);
  };
  // END - open and close modal view, export, and delete warning handler

  const handleDeleteInsurer = (insuredId: number) => {
    if (insuredId) {
      deleteVendor(insuredId, {
        onSuccess: () => {
          setNotifMsg({
            notificationType: "success",
            notificationTitle: "Success delete insured",
            notificationDescription: "Insured delete successfully!",
          });
          closeModalDelete();
          refetch();
        },
        onError: (error: any) => {
          setNotifMsg({
            notificationType: "error",
            notificationTitle: "Error delete insured",
            notificationDescription: error.message,
          });
          closeModalDelete();
        },
      });
    }
  };

  const dataSource: VendorTableType[] =
    data?.data.map((_data, index) => ({
      ..._data,
      id: index,
      key: index,
      actions: (
        <Space>
          <IconButton tooltip="View" onClick={() => openViewInsured(_data.id)}>
            <BsThreeDots size={25} />
          </IconButton>
          <IconButton
            tooltip="Edit"
            onClick={() => push(`/insured/edit/${_data.id}`)}>
            <BiEdit size={25} />
          </IconButton>
          <IconButton
            tooltip="Delete"
            onClick={() => openModalDelete(_data.id)}>
            <BsTrash size={25} />
          </IconButton>
        </Space>
      ),
    })) ?? [];

  const columns: ColumnsType<VendorTableType> = [
    {
      title: "No",
      dataIndex: "No",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: {compare: (a, b) => a.name.localeCompare(b.name)},
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: {compare: (a, b) => a.email.localeCompare(b.email)},
    },
    {
      title: "Person In Charge",
      dataIndex: "pic",
      sorter: {compare: (a, b) => a.pic.localeCompare(b.pic)},
    },
    {
      title: "Action",
      dataIndex: "actions",
    },
  ];

  return (
    <>
      <Table
        datePicker
        title="Insureds"
        columns={columns}
        loading={isLoading}
        dataSource={dataSource}
        onExportButton={openModalExport}
        onPrintButton={openModalExport}
        onAddButton={() => push("/insured/add")}
        onImportButton={() => push("/insured/import")}
        pagination={paginationFromResponse(data)}
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
      />
      <Modal
        open={isOpen}
        footer={null}
        onCancel={
          isOpenedDelete
            ? closeModalDelete
            : isOpenedExport
            ? cancelModalExport
            : closeViewInsured
        }
        title={
          isOpenedExport ? (
            <>
              <h1 className="text-lg font-semibold text-gray-600 mb-6">
                Export / Print Insureds
              </h1>
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-gray-600">
                Detail Database Insureds
              </h1>
              <Divider className="mt-[16px]" />
            </>
          )
        }>
        {filteredVendor.length > 0 && (
          <Space size={12}>
            <ul className="list-disc px-5">
              <li>Insured Name</li>
              <li>Insured Address</li>
              <li>Insured Type</li>
              <li>Insured Contact</li>
              <li>Insured Email</li>
              <li>Insured PIC</li>
              <li>Insured Website</li>
            </ul>
            <div>
              {filteredVendor.map((vendor) => (
                <ol key={vendor.id}>
                  <li>
                    <p className="flex flex-wrap gap-7">
                      <span>:</span>
                      {vendor.name}
                    </p>
                  </li>
                  <li>
                    <p className="flex flex-wrap gap-7">
                      <span>:</span>
                      {vendor.address}
                    </p>
                  </li>
                  <li>
                    <p className="flex flex-wrap gap-7">
                      <span>:</span>
                      {vendor.type_vendor}
                    </p>
                  </li>
                  <li>
                    <p className="flex flex-wrap gap-7">
                      <span>:</span>
                      {vendor.phone}
                    </p>
                  </li>
                  <li>
                    <p className="flex flex-wrap gap-7">
                      <span>:</span>
                      {vendor.email}
                    </p>
                  </li>
                  <li>
                    <p className="flex flex-wrap gap-7">
                      <span>:</span>
                      {vendor.pic}
                    </p>
                  </li>
                  <li>
                    <p className="flex flex-wrap gap-7">
                      <span>:</span>
                      {vendor.website}
                    </p>
                  </li>
                </ol>
              ))}
            </div>
          </Space>
        )}
        {isOpenedExport && (
          <div className="flex flex-col gap-3">
            <Button
              type="ghost"
              size="large"
              icon={<FaFilePdf />}
              loading={isLoadingExportPDF}
              onClick={() => exportVendorPDF()}
              className="bg-primary-500 text-white flex items-center justify-center text-lg">
              {isLoadingExportPDF ? "Loading PDF" : "PDF"}
            </Button>
            <Button
              type="ghost"
              size="large"
              icon={<FaFileExcel />}
              loading={isLoadingExportExcel}
              onClick={() => exportVendorExcel()}
              className="bg-primary-500 text-white flex items-center justify-center text-lg">
              {isLoadingExportExcel ? "Downloading Excel" : "Excel"}
            </Button>
          </div>
        )}
        {isOpenedDelete && (
          <>
            <div className="mb-7 flex flex-col items-center gap-3">
              <IoWarning size={74} className="text-red-500" />
              <span className="space-y-2 text-center">
                <h1 className="text-center text-[20px] font-semibold text-red-600">
                  Are you sure wanna delete this broker?
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
                onClick={closeModalDelete}
                className="border-red-600 text-red-500">
                Cancel
              </Button>
              <Button
                type="ghost"
                size="large"
                loading={isLoadingDeleteVendor}
                onClick={() => handleDeleteInsurer(vendorId)}
                className="bg-red-600 text-white">
                Delete Broker
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default InsuredLists;
