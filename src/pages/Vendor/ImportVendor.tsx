import cx from "classnames";
import {useEffect} from "react";
import {Button, Tabs} from "antd";
import {useImportVendor} from "hooks/query";
import PageTitle from "components/ui/PageTitle";
import {atom, useAtom, useSetAtom} from "jotai";
import {useNotification} from "hooks/atom/useAtom";
import {useForm, SubmitHandler} from "react-hook-form";
import {ImportVendorType, VendorData, VendorMainData} from "interfaces";
import {
  FormContainer,
  DownloadTemplate,
  BulkUploadInsureds,
} from "./components";
import {useHistory} from "react-router";

type uploadedExcelInitState = {
  file: File | undefined;
  contents: VendorMainData[];
};

type UseUploadedExcel = {
  setFileExcel: (file: File | undefined) => void;
  setExtractedContents: (contents: VendorMainData[]) => void;
};

export const uploadedExcelAtom = atom<uploadedExcelInitState>({
  file: undefined,
  contents: [],
});

export const useUploadedExcel = (): UseUploadedExcel => {
  const setUploadedExcel = useSetAtom(uploadedExcelAtom);

  const setFileExcel = (file: File | undefined) => {
    setUploadedExcel((prevState) => ({...prevState, file: file}));
  };
  const setExtractedContents = (contents: VendorMainData[]) => {
    setUploadedExcel((prevState) => ({...prevState, contents: contents}));
  };

  return {setFileExcel, setExtractedContents};
};

const ImportVendor = () => {
  const {push} = useHistory();
  const {setNotification} = useNotification();
  const {setValue, handleSubmit} = useForm<ImportVendorType>();
  const [uploadedExcel, setUploadedExcel] = useAtom(uploadedExcelAtom);
  const {mutate: importVendor, isLoading: isLoadingImport} = useImportVendor();
  const importBreadcrumbs = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Database",
      href: "/insured",
    },
    {
      title: "Bulk Upload Of Insured Data",
    },
  ];
  const itemTabs = new Array(2).fill(null).map((_, idx) => {
    const id = String(idx + 1);
    return {
      key: id,
      label: id === "2" ? "Upload" : "Download",
      children: id === "2" ? <BulkUploadInsureds /> : <DownloadTemplate />,
    };
  });

  useEffect(() => {
    if (uploadedExcel.file) {
      setValue("excelFile", uploadedExcel.file);
    }
  }, [uploadedExcel]);

  const handleSubmitFile: SubmitHandler<ImportVendorType> = (data) => {
    if (data) {
      importVendor(data.excelFile, {
        onSuccess: () => {
          setNotification({
            notificationType: "success",
            notificationTitle: "Import insureds success",
            notificationDescription:
              "File uploaded and insured import successfully!",
          });
          push("/insured");
        },
        onError: (error: any) => {
          setNotification({
            notificationType: "error",
            notificationTitle: "Failed import insureds",
            notificationDescription: error.message,
          });
        },
      });
    }
  };
  return (
    <>
      <PageTitle
        pageTitle="Bulk Upload Of Insured Data"
        pageBreadcrumbs={importBreadcrumbs}
      />
      <FormContainer>
        <Tabs type="card" items={itemTabs} tabBarGutter={10} />
      </FormContainer>
      <div className="flex justify-end gap-4 items-center">
        <Button
          ghost
          onClick={() => push("/insured")}
          className="flex items-center border-primary-400 text-primary-600 text-[0.995rem] font-semibold px-24 py-[1.45rem] rounded-xl">
          Cancel
        </Button>
        <Button
          ghost
          disabled={uploadedExcel.contents.length === 0}
          onClick={handleSubmit(handleSubmitFile)}
          className={cx(
            "flex items-center text-[0.995rem] px-16 py-[1.45rem]",
            {
              "bg-gray-400 text-white rounded-xl":
                uploadedExcel.contents.length === 0,
              "bg-primary-600 text-white rounded-xl":
                uploadedExcel.contents.length > 0,
            },
          )}>
          Upload File To Database
        </Button>
      </div>
    </>
  );
};

export default ImportVendor;
