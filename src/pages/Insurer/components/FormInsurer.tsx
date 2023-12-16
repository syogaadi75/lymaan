import {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {useForm, SubmitHandler} from "react-hook-form";

import {Button, notification} from "antd";
import Breadcrumb from "components/ui/Breadcrumb";
import FormContainer from "./FormContainer";
import InsurerEntry from "./InsurerEntry";
import BulkUploadInsurer from "./BulkUploadInsurer";

import {useAtom} from "jotai";
import {useImportCompany} from "hooks/query";
import {NotificationType, notificationAtom} from "hooks/atom/useAtom";
import {
  InsurerDataResponse,
  InsurerData,
  ImportInsurerTemplate,
} from "interfaces";

type FormInsurerType = {
  action: string;
  insurer?: InsurerDataResponse<InsurerData>;
};

const FormInsurer = ({action, insurer}: FormInsurerType) => {
  const {push} = useHistory();
  const [api, contextHolder] = notification.useNotification();
  const [notificationMsg, setNotificationMsg] = useAtom(notificationAtom);
  const [uploadedFiles, setUploadedFiles] = useState<File | null>(null);
  const [extractedExcel, setExtractedExcel] = useState<InsurerData[]>([]);

  const {mutate: importCompany, isLoading} = useImportCompany();
  const {handleSubmit, setValue} = useForm<ImportInsurerTemplate>();

  const handleUploadExcel = (
    name: keyof ImportInsurerTemplate,
    file: File,
  ): void => {
    if (name === "excelFile") {
      setValue("excelFile", file);
    }
  };

  const handleCancel = () => {
    push("/insurer");
    setUploadedFiles(null);
    setExtractedExcel([]);
  };

  const handleSubmitFile: SubmitHandler<ImportInsurerTemplate> = (data) => {
    if (data) {
      const {excelFile} = data;
      importCompany(excelFile, {
        onSuccess: () => {
          setNotificationMsg({
            notificationType: "success",
            notificationTitle: "Success importing insurer!",
            notificationDescription: `Success importing ${extractedExcel.length} insurer and upload file to database !`,
          });
        },
        onError: (error: any) => {
          setNotificationMsg({
            notificationType: "error",
            notificationTitle: "Error importing insurer...",
            notificationDescription: error.message,
          });
        },
      });
    }
  };

  const insurerBreadcrumb = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Database",
      href: "/insurer",
    },
    {
      title: "Insurer",
      href: "/insurer",
    },
    {
      title:
        action === "add"
          ? "Add Insurer"
          : action === "edit"
          ? "Edit Insurer"
          : null,
    },
  ];

  return (
    <>
      {contextHolder}
      <h1 className="text-2xl font-medium">
        {action === "add"
          ? "Add Insurer"
          : action === "edit"
          ? "Edit Insurer"
          : null}
      </h1>
      <Breadcrumb separator=">" items={insurerBreadcrumb} />
      <FormContainer>
        {action === "add" ? (
          <BulkUploadInsurer
          // uploadedFiles={uploadedFiles}
          // extractedExcel={extractedExcel}
          // setUploadedFiles={setUploadedFiles}
          // setExtractedExcel={setExtractedExcel}
          />
        ) : action === "edit" ? (
          <InsurerEntry oldData={insurer} />
        ) : null}
      </FormContainer>
      {action === "add" ? (
        <div className="flex flex-wrap justify-end gap-5 mt-10 mb-16">
          <Button
            onClick={handleCancel}
            type="ghost"
            className="flex items-center py-5 px-24 text-[16px] font-semibold text-primary-600 border-primary-600">
            Cancel
          </Button>
          <Button
            type="ghost"
            onClick={handleSubmit(handleSubmitFile)}
            className="flex items-center py-5 px-14 text-[16px] capitalize text-white bg-primary-600">
            upload file to database
          </Button>
        </div>
      ) : action === "edit" ? (
        <div className="flex flex-wrap justify-end gap-5 mt-10 mb-16">
          <Button
            onClick={handleCancel}
            size="large"
            type="ghost"
            className="flex items-center py-6 px-5 text-xl text-white bg-primary-200">
            Cancel
          </Button>
          <Button
            size="large"
            type="ghost"
            className="flex items-center py-6 px-5 text-xl text-white bg-primary-600">
            Save
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default FormInsurer;
