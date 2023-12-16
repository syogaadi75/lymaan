import {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {formatDate} from "utils";

import {Button, Divider, Modal, Space, notification} from "antd";
import {ColumnsType} from "antd/es/table";
import {BsThreeDots} from "react-icons/bs";
import {BiEdit, BiTrash} from "react-icons/bi";
import {HiOutlinePrinter} from "react-icons/hi2";

import PageTitle from "components/ui/PageTitle";
import Table, {paginationFromResponse} from "components/ui/Table";
import IconButton from "components/ui/buttons/IconButton";

import {
  ApiListRequest,
  BrokersApiType,
  BrokerListsTableType,
  defaultApiListOptions,
} from "interfaces";
import {
  useDeleteBroker,
  useExportBrokerExcel,
  useExportBrokerPDF,
  useGetListBroker,
} from "hooks/query";

import {atom, useAtom, useSetAtom} from "jotai";
import {NotificationType, notificationAtom} from "hooks/atom/useAtom";
import {useDisclosure} from "hooks";
import {IoWarning} from "react-icons/io5";
import {useQueryClient} from "react-query";
import {FaFileExcel, FaFilePdf} from "react-icons/fa";

// start brokers global state
type UseUplooadFile = {
  setUploadedFile: (uploadedFile: File | null) => void;
};

type UseExtractedBrokers = {
  setExtractedBrokers: (extractedBrokers: BrokersApiType[]) => void;
};

type UseSuccessMutate = {
  setSuccessMutate: (successMutate: boolean) => void;
};

export const successMutateAtom = atom<boolean>(false);
export const uploadedFileAtom = atom<File | null>(null);
export const extractedBrokersAtom = atom<BrokersApiType[]>([]);

export const useSuccessMutate = (): UseSuccessMutate => {
  const setSuccessMutate = useSetAtom(successMutateAtom);
  return {setSuccessMutate};
};

export const useUploadFile = (): UseUplooadFile => {
  const setUploadedFile = useSetAtom(uploadedFileAtom);
  return {setUploadedFile};
};

export const useExtractedBrokers = (): UseExtractedBrokers => {
  const setExtractedBrokers = useSetAtom(extractedBrokersAtom);
  return {setExtractedBrokers};
};
// end brokers global state

const ButtonsAction = ({
  viewAction,
  editAction,
  deleteAction,
}: {
  viewAction: () => void;
  editAction: () => void;
  deleteAction: () => void;
}) => {
  return (
    <Space>
      <IconButton tooltip="View" onClick={viewAction}>
        <BsThreeDots size={25} />
      </IconButton>
      <IconButton tooltip="Print">
        <HiOutlinePrinter size={25} />
      </IconButton>
      <IconButton tooltip="Edit" onClick={editAction}>
        <BiEdit size={25} />
      </IconButton>
      <IconButton tooltip="Delete" onClick={deleteAction}>
        <BiTrash size={25} />
      </IconButton>
    </Space>
  );
};

const BrokerLists = () => {
  const {push} = useHistory();
  const queryClient = useQueryClient();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [api, contextHolder] = notification.useNotification();
  const [brokerId, setBrokerId] = useState<number>(0);
  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [exportModalShown, setExportModalShown] = useState<boolean>(false);
  const [modalData, setModalData] = useState<BrokersApiType | undefined>();
  const [listOption, setListOption] = useState<ApiListRequest>(
    defaultApiListOptions,
  );

  const [notifMsg, setNotifMsg] = useAtom(notificationAtom);
  const [uploadedFile, setUploadedFile] = useAtom(uploadedFileAtom);
  const [isMutateSuccess, setIsMutateSuccess] = useAtom(successMutateAtom);
  const [extractedBrokers, setExtractedBrokers] = useAtom(extractedBrokersAtom);

  const {data, isLoading, refetch} = useGetListBroker(listOption);
  const brokerDatas = data?.data;

  const {mutate: deleteBroker} = useDeleteBroker();
  const {mutate: exportBrokerPDF} = useExportBrokerPDF();
  const {mutate: exportBrokerExcel} = useExportBrokerExcel();

  const breadcrumbs = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Database",
      href: "/brokers",
    },
    {title: "Brokers"},
  ];

  const columns: ColumnsType<BrokerListsTableType> = [
    {
      title: "No",
      dataIndex: "no",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
    },
    {
      title: "Company Name",
      dataIndex: "company",
      sorter: {
        compare: (a, b) => a.company.localeCompare(b.company),
      },
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      sorter: {
        compare: (a, b) => a.created_at.localeCompare(b?.created_at),
      },
    },
    {title: "Actions", dataIndex: "button_actions"},
  ];

  const openExportModal = () => {
    onOpen();
    setExportModalShown(true);
  };

  const openDeleteModal = (id: number) => {
    onOpen();
    setBrokerId(id);
    setIsDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModal(false);
    onClose();
  };

  const cancelExportBrokers = () => {
    setExportModalShown(false);
    onClose();
  };

  const handleViewDetail = (id: number) => {
    const brokerFiltered = brokerDatas?.find((broker) => broker.id === id);
    setModalData(brokerFiltered);
    onOpen();
  };

  const closeViewDetail = () => {
    setModalData(undefined);
    onClose();
  };

  const handleEditBroker = (id: number) => {
    push(`/broker/edit/${id}`);
  };

  const handleDeleteBroker = (id: number) => {
    deleteBroker(id, {
      onSuccess: () => {
        queryClient.invalidateQueries("get-list-broker");
        setNotifMsg({
          notificationType: "success",
          notificationTitle: "Delete broker success",
          notificationDescription: "Broker deleted successfully...",
        });
        setIsMutateSuccess(true);
        onClose();
      },
      onError: (error: any) => {
        setNotifMsg({
          notificationType: "error",
          notificationTitle: "Delete broker error",
          notificationDescription: error.message,
        });
      },
    });
  };

  const dataSource: BrokerListsTableType[] =
    data?.data.map((data, index: number) => {
      return {
        key: index,
        id: index,
        name: data.name,
        company: data.company,
        address: data.address,
        phone: data.phone,
        affiliation: data.affiliation,
        created_at: formatDate(new Date(data.created_at)),
        button_actions: (
          <ButtonsAction
            viewAction={() => handleViewDetail(data.id)}
            editAction={() => handleEditBroker(data.id)}
            deleteAction={() => openDeleteModal(data.id)}
          />
        ),
      };
    }) ?? [];

  const onShowNotif = (contents: NotificationType) => {
    switch (true) {
      case contents.notificationType === "success":
        return api.success({
          message: contents.notificationTitle,
          description: contents.notificationDescription,
          placement: "top",
        });

      case contents.notificationType === "error":
        return api.error({
          message: contents.notificationTitle,
          description: contents.notificationDescription,
          placement: "top",
        });

      case contents.notificationType === "warning":
        return api.warning({
          message: contents.notificationTitle,
          description: contents.notificationDescription,
          placement: "top",
        });

      case contents.notificationType === "info":
        return api.info({
          message: contents.notificationTitle,
          description: contents.notificationDescription,
          placement: "top",
        });

      default:
        break;
    }
  };

  useEffect(() => {
    if (notifMsg && uploadedFile !== null && extractedBrokers.length !== 0) {
      onShowNotif(notifMsg);
    } else if (isMutateSuccess) {
      onShowNotif(notifMsg);
    }
  }, [uploadedFile, extractedBrokers, notifMsg, isMutateSuccess]);

  return (
    <>
      {contextHolder}
      <PageTitle pageTitle="Brokers" pageBreadcrumbs={breadcrumbs} />
      <Table
        datePicker
        title="Brokers"
        loading={isLoading}
        columns={columns}
        dataSource={dataSource}
        onAddButton={() => push("/broker/add")}
        onImportButton={() => push("/brokers/import")}
        onExportButton={openExportModal}
        onPrintButton={openExportModal}
        onReloadButton={() => refetch()}
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
        width={600}
        title={
          <>
            {isDeleteModal && (
              <>
                <h1 className="text-lg font-semibold text-gray-600 mb-0">
                  Delete Broker Confirmation
                </h1>
                <Divider className="mt-[24px]" />
              </>
            )}
            {exportModalShown && (
              <>
                <h1 className="text-lg font-semibold text-gray-600 mb-6">
                  Export Brokers
                </h1>
              </>
            )}

            {isDeleteModal || exportModalShown ? null : (
              <>
                <h1 className="text-lg font-semibold text-gray-600 mb-0">
                  Detail Database Broker
                </h1>
                <Divider className="mt-[24px]" />
              </>
            )}
          </>
        }
        open={isOpen}
        onCancel={
          isDeleteModal
            ? closeDeleteModal
            : exportModalShown
            ? cancelExportBrokers
            : closeViewDetail
        }
        footer={null}>
        {modalData && (
          <ul>
            <li>
              Broker's Full Name <span>: {modalData.name}</span>
            </li>
            <li>
              Broker's Address <span>: {modalData.address}</span>
            </li>
            <li>
              Broker's Phone Number <span>: {modalData.phone}</span>
            </li>
            <li>
              Broker's Company <span>: {modalData.company}</span>
            </li>
            <li>
              Broker's Company <span>: {modalData.affiliation}</span>
            </li>
          </ul>
        )}
        {isDeleteModal && (
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
                onClick={closeDeleteModal}
                className="border-red-600 text-red-500">
                Cancel
              </Button>
              <Button
                type="ghost"
                size="large"
                onClick={() => handleDeleteBroker(brokerId)}
                className="bg-red-600 text-white">
                Delete Broker
              </Button>
            </div>
          </>
        )}
        {exportModalShown && (
          <div className="flex flex-col gap-3">
            <Button
              type="ghost"
              size="large"
              icon={<FaFilePdf />}
              onClick={() => exportBrokerPDF()}
              className="bg-primary-500 text-white flex items-center justify-center text-lg">
              PDF
            </Button>
            <Button
              type="ghost"
              size="large"
              icon={<FaFileExcel />}
              onClick={() => exportBrokerExcel()}
              className="bg-primary-500 text-white flex items-center justify-center text-lg">
              Excel
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default BrokerLists;
