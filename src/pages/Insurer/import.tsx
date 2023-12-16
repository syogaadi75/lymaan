import {useHistory} from "react-router";

import cx from "classnames";
import {useAtom} from "jotai";
import {useEffect, useState} from "react";
import {Button} from "antd";
import {SubmitHandler, useForm} from "react-hook-form";

import PageTitle from "components/ui/PageTitle";
import BulkUploadInsurer from "./components/BulkUploadInsurer";
import FormContainer from "./components/FormContainer";

import {useImportCompany} from "hooks/query";
import {ImportInsurerTemplate} from "interfaces";
import {
  extractedInsurersAtom,
  uploadedExcelAtom,
} from "./components/ListInsurer";
import {useNotification} from "hooks/atom/useAtom";

const ImportInsurer = () => {
  const {push} = useHistory();
  const {setNotification} = useNotification();

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [uploadedExcel, setUploadedExcel] = useAtom(uploadedExcelAtom);
  const [extractedInsurers, setExtractedInsurers] = useAtom(
    extractedInsurersAtom,
  );

  const {mutate: importCompany} = useImportCompany();
  const {setValue, handleSubmit, getValues} = useForm<ImportInsurerTemplate>();

  const handleSetFile = (
    fieldName: keyof ImportInsurerTemplate,
    file: File,
  ) => {
    setValue(fieldName, file);
  };

  const handleCancelImport = () => {
    setExtractedInsurers([]);
    setUploadedExcel(null);
    push("/insurer");
  };

  const onSubmitFile: SubmitHandler<ImportInsurerTemplate> = (data) => {
    if (data) {
      importCompany(data.excelFile, {
        onSuccess: () => {
          setNotification({
            notificationType: "success",
            notificationTitle: "Success import insurer",
            notificationDescription: "Import insurer success!",
          });
          push("/insurer");
        },
        onError: (error: any) => {
          setNotification({
            notificationType: "error",
            notificationTitle: "Error import insurer",
            notificationDescription: error.message,
          });
        },
      });
    }
  };

  const insurerBreadcrumbs = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Insurers",
      href: "/insurer",
    },
    {
      title: "Import Insurer",
    },
  ];

  useEffect(() => {
    if (uploadedExcel) {
      handleSetFile("excelFile", uploadedExcel);
    }
  }, [uploadedExcel]);

  useEffect(() => {
    if (extractedInsurers.length === 0) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [uploadedExcel, extractedInsurers]);
  return (
    <>
      <PageTitle
        pageTitle="Import Insurer"
        pageBreadcrumbs={insurerBreadcrumbs}
      />
      <FormContainer>
        <BulkUploadInsurer />
      </FormContainer>
      <div className="flex flex-wrap gap-3 justify-end">
        <Button
          type="ghost"
          onClick={handleCancelImport}
          className="flex items-center border-primary-400 text-primary-400 text-[15px] px-20 py-5 rounded-lg">
          Cancel
        </Button>
        <Button
          type="ghost"
          disabled={isButtonDisabled}
          onClick={handleSubmit(onSubmitFile)}
          className={cx("flex items-center text-[15px] px-12 py-5 rounded-lg", {
            "bg-primary-100 text-white": isButtonDisabled,
            "bg-primary-400 text-white": !isButtonDisabled,
          })}>
          {isButtonDisabled
            ? "Upload modified template first"
            : "Upload file to Database"}
        </Button>
      </div>
    </>
  );
};

export default ImportInsurer;
