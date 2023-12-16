import {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {Button, Tabs, notification} from "antd";

import {useAtom} from "jotai";
import {SubmitHandler, useForm} from "react-hook-form";

import {NotificationType, notificationAtom} from "hooks/atom/useAtom";
import {useImportBroker} from "hooks/query";

import PageTitle from "components/ui/PageTitle";
import FormContainer from "./components/FormContainer";
import DownloadTemplate from "./components/DownloadTemplate";
import UploadBulkBrokers from "./components/UploadBulkBrokers";
import {extractedBrokersAtom, uploadedFileAtom} from "./components/BrokerLists";

import {ImportBrokerResponse, ImportBulkBroker} from "interfaces";

interface OnSwitchTabType {
  id: string;
  onSetValue: (fieldname: string, fieldValue: File) => void;
}

const OnSwitchTab = ({id, onSetValue}: OnSwitchTabType) => {
  switch (true) {
    case id === "2":
      return <UploadBulkBrokers setValue={onSetValue} />;

    default:
      return <DownloadTemplate />;
  }
};

const ImportBroker = () => {
  const {push} = useHistory();
  const [api, contextHolder] = notification.useNotification();
  const [isDisableUpload, setIsDisableUpload] = useState<boolean>(false);

  const [uploadedFile, setUploadedFile] = useAtom(uploadedFileAtom);
  const [notificationMsg, setNotificationMsg] = useAtom(notificationAtom);
  const [extractedBrokers, setExtractedBrokers] = useAtom(extractedBrokersAtom);

  const {mutate: importBroker} = useImportBroker();
  const {handleSubmit, setValue} = useForm<ImportBulkBroker>();

  const breadcrumbs = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Brokers",
      href: "/brokers",
    },
    {
      title: "Add Broker",
    },
  ];

  const handleCloseAdd = () => {
    push("/brokers");
    setUploadedFile(null);
    setExtractedBrokers([]);
  };

  const handleSetValue = (fieldname: string, fieldValue: File) => {
    if (fieldname === "brokersInputFile") {
      setValue(fieldname, fieldValue);
    }
  };

  const itemTabs = new Array(2).fill(null).map((_, idx) => {
    const id = String(idx + 1);
    return {
      key: id,
      label: id === "2" ? "Upload" : "Download",
      children: (
        <>
          <OnSwitchTab id={id} onSetValue={handleSetValue} />
        </>
      ),
    };
  });

  const showBrokerNotif = (contentNotif: NotificationType) => {
    switch (true) {
      case contentNotif.notificationType === "success":
        return api.success({
          message: contentNotif.notificationTitle,
          description: contentNotif.notificationDescription,
          placement: "bottomRight",
        });

      case contentNotif.notificationType === "error":
        return api.error({
          message: contentNotif.notificationTitle,
          description: contentNotif.notificationDescription,
          placement: "bottomRight",
        });

      case contentNotif.notificationType === "warning":
        return api.warning({
          message: contentNotif.notificationTitle,
          description: contentNotif.notificationDescription,
          placement: "bottomRight",
        });

      case contentNotif.notificationType === "info":
        return api.info({
          message: contentNotif.notificationTitle,
          description: contentNotif.notificationDescription,
          placement: "bottomRight",
        });

      default:
        break;
    }
  };

  const handleSubmitBrokers: SubmitHandler<ImportBulkBroker> = (data) => {
    if (data) {
      importBroker(data.brokersInputFile, {
        onSuccess: (data: ImportBrokerResponse) => {
          setNotificationMsg({
            notificationType: "success",
            notificationTitle: "Success import brokers!",
            notificationDescription: data.message,
          });
          push("/brokers");
        },
        onError: (res: any) => {
          if (res) {
            setNotificationMsg({
              notificationType: "error",
              notificationTitle: "Error import brokers",
              notificationDescription: res.message,
            });
          }
        },
      });
    }
  };

  useEffect(() => {
    if (
      uploadedFile !== null &&
      extractedBrokers.length >= 0 &&
      notificationMsg
    ) {
      showBrokerNotif(notificationMsg);
    }

    if (extractedBrokers.length < 1) {
      setIsDisableUpload(true);
    } else {
      setIsDisableUpload(false);
    }
  }, [notificationMsg, extractedBrokers]);

  return (
    <>
      {contextHolder}
      <PageTitle pageTitle="Add Broker" pageBreadcrumbs={breadcrumbs} />
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(handleSubmitBrokers)}>
        <FormContainer>
          <Tabs type="card" items={itemTabs} tabBarGutter={10} />
        </FormContainer>
        <div className="flex flex-wrap justify-end items-center gap-3">
          <Button
            type="ghost"
            onClick={handleCloseAdd}
            className="border-primary-200 w-fit h-fit px-24 py-2 text-rimary-200 font-medium text-[16px]">
            Cancel
          </Button>
          <Button
            type="ghost"
            htmlType="submit"
            disabled={isDisableUpload}
            className="bg-primary-600 disabled:bg-gray-400 w-fit h-fit px-16 py-2 text-white font-medium text-[16px]">
            Upload File to Database
          </Button>
        </div>
      </form>
    </>
  );
};

export default ImportBroker;
