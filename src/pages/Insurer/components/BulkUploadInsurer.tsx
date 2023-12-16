import React, {useRef, useState} from "react";
import {useDropzone} from "react-dropzone";
import * as XLSX from "xlsx";

import {Button, Space, Spin, Tabs, Table, PaginationProps} from "antd";
import {ColumnsType} from "antd/es/table";

import {ReactComponent as ImageUpload} from "public/icons/image-up.svg";
import {ReactComponent as IconCSV} from "public/icons/csv-logo.svg";

import {useAtom} from "jotai";
import {InsurerData, InsurerMainData} from "interfaces";
import {useNotification} from "hooks/atom/useAtom";
import {
  extractedInsurersAtom,
  uploadedExcelAtom,
} from "../components/ListInsurer";
import {FaFileExcel} from "react-icons/fa";
import {AiOutlineClose} from "react-icons/ai";

interface InsurerDataTable extends InsurerMainData {
  key: React.Key;
  actions?: React.ReactElement;
}

const DownloadTab = () => {
  const {setNotification} = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = () => {
    const file = "/file_template/company_new_template_database.xlsx";
    const filename = "company_new_template_database.xlsx";
    const link = document.createElement("a");

    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        if (link && file && filename) {
          link.download = filename;
          link.href = file;
          link.click();
          setNotification({
            notificationType: "success",
            notificationTitle: "Success download Excel Template!",
            notificationDescription:
              "Excel template database insurer downloaded successfully!",
          });
          setIsLoading(false);
        }
      }, 1000);
    }, 1000);
  };
  return (
    <ul className="flex flex-col gap-5 font-medium">
      <li className="flex flex-col gap-3">
        <span>1. Download Template CSV Insurer Data</span>
        <Button
          className={`flex items-center border-primary-500 hover:bg-primary-500 hover:text-white w-fit h-fit ml-3 px-6 py-2 text-xs font-semibold hover:font-medium`}
          loading={isLoading}
          onClick={handleDownload}
          icon={isLoading ? <Spin /> : <FaFileExcel />}
          type="ghost">
          {isLoading ? "Downloading CSV" : "Download Template"}
        </Button>
      </li>
      <li>2. Adjust the data you want to add with the downloaded template.</li>
      <li>3. Go to the "Upload" tab to upload the template.</li>
    </ul>
  );
};

const UploadTab = () => {
  const {setNotification} = useNotification();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedExcel, setUploadedExcel] = useAtom(uploadedExcelAtom);
  const [extractedInsurers, setExtractedInsurers] = useAtom(
    extractedInsurersAtom,
  );

  const tableColumn: ColumnsType<InsurerMainData> = [
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
      title: "Address",
      dataIndex: "address",
      sorter: {
        compare: (a, b) => a.address.localeCompare(b.address),
      },
    },
    {
      title: "Contact",
      dataIndex: "contact",
      sorter: {
        compare: (a, b) => a.contact.localeCompare(b.contact),
      },
    },
    {
      title: "PIC",
      dataIndex: "person_incharge",
      sorter: {
        compare: (a, b) => a.person_incharge.localeCompare(b.person_incharge),
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: {
        compare: (a, b) => a.email.localeCompare(b.email),
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: {
        compare: (a, b) => a.phone.localeCompare(b.phone),
      },
    },
    {
      title: "Website",
      dataIndex: "website",
      sorter: {
        compare: (a, b) => a.website.localeCompare(b.website),
      },
    },
    // {title: "Action", dataIndex: "actions"},
  ];

  const handleSelectFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryString = event.target?.result as string;
      const workbook = XLSX.read(binaryString, {type: "binary"});
      const sheetname = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetname];
      const XLSXData = XLSX.utils.sheet_to_json(worksheet);

      const allowedFileHeaders = [
        "contact",
        "name",
        "person_incharge",
        "email",
        "phone",
        "website",
        "address",
      ];

      type InsurerXLSType = {
        name: string;
        contact: string;
        person_incharge: string;
        email: string;
        phone: string;
        website: string;
        address: string;
      };

      const isAllowedHeaders =
        XLSXData.length > 0 &&
        allowedFileHeaders.every((header) =>
          Object.keys(XLSXData[0] as InsurerXLSType).includes(header),
        );

      if (!isAllowedHeaders) {
        setNotification({
          notificationType: "error",
          notificationTitle: "Error parse Excel",
          notificationDescription:
            "Error parsing uploaded Excel! Please check content of file",
        });
        return;
      }

      const extractedData: InsurerMainData[] =
        XLSXData.map((rowData: any, index: number) => {
          return {
            id: index,
            name: rowData.name,
            address: rowData.address,
            contact: rowData.contact,
            phone: rowData.phone,
            email: rowData.email,
            person_incharge: rowData.person_incharge,
            type_vendor: rowData.type_vendor,
            website: rowData.website,
          };
        }) ?? [];

      setNotification({
        notificationType: "success",
        notificationTitle: "Success upload insurer",
        notificationDescription:
          "Success upload insurer! Before upload to database make sure if all data are correct",
      });

      setExtractedInsurers(extractedData);
    };
    reader.readAsBinaryString(file);
    setUploadedExcel(file);
  };

  const {getRootProps, getInputProps, isDragActive, acceptedFiles} =
    useDropzone({
      onDrop,
      noClick: true,
      noKeyboard: true,
      multiple: true,
    });

  const handleClearCSV = () => {
    acceptedFiles.length = 0;
    acceptedFiles.splice(0, acceptedFiles.length);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setUploadedExcel(null);
    setExtractedInsurers([]);
  };

  const handleSelectFileAgain = () => {
    handleClearCSV();
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const dataSource: InsurerDataTable[] =
    extractedInsurers?.map((data, index) => ({
      ...data,
      key: index + 1,
    })) ?? [];

  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement,
  ) => {
    if (type === "prev") return <a>Previous</a>;
    if (type === "next") return <a>Next</a>;
    return originalElement;
  };

  return (
    <Space direction="vertical" className="w-full" size={14}>
      <label htmlFor="upload_csv">
        Please upload the complete template file
      </label>
      <div className="flex flex-col items-center gap-4 border border-dashed rounded-[0.35rem] border-primary-100 h-fit p-5">
        <div {...getRootProps()} className="flex flex-col items-center gap-2">
          <input
            {...getInputProps()}
            name="excelFile"
            ref={inputRef}
            accept=".xlsx"
          />
          {isDragActive ? (
            <>Drop files here</>
          ) : uploadedExcel ? (
            <div className="flex items-center gap-3">
              <IconCSV />
              <div className="flex flex-col">
                <p className="text-xs">{uploadedExcel.name}</p>
                <p className="text-xs">
                  {(uploadedExcel.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                type="ghost"
                icon={<AiOutlineClose />}
                onClick={handleClearCSV}
              />
            </div>
          ) : (
            <>
              <ImageUpload />
              <p className="text-[11px] text-primary-100">
                Drag and drop files here
              </p>
              <span className="text-[8px] text-gray-300">
                Supported format : CSV
              </span>
            </>
          )}
        </div>
        <Button
          onClick={uploadedExcel ? handleSelectFile : handleSelectFileAgain}
          type="ghost"
          className="bg-primary-500 text-white w-fit h-fit text-[10px] py-[0.4rem] px-20">
          {uploadedExcel ? "Change File" : "Upload File"}
        </Button>
      </div>
      {dataSource && dataSource.length > 1 && (
        <>
          <h1>
            Please verify the accuracy of the data you have uploaded below.
          </h1>
          <Table
            columns={tableColumn}
            dataSource={dataSource}
            pagination={{
              position: ["bottomCenter"],
              defaultPageSize: 10,
              itemRender: itemRender,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "25", "50", "75", "100"],
            }}
          />
        </>
      )}
    </Space>
  );
};

const BulkUploadInsurer = () => {
  // const handleDeleteInsurer = (dataId: number) => {
  //   extractedExcel.splice(dataId + 1, 1);
  //   const modifiedData = [...extractedExcel];
  //   setExtractedExcel(modifiedData);
  // };

  const itemTabs = new Array(2).fill(null).map((_, i) => {
    const id = String(i + 1);
    return {
      label: id === "2" ? "Upload" : "Download",
      key: id,
      children: id === "2" ? <UploadTab /> : <DownloadTab />,
    };
  });

  return (
    <>
      <Tabs
        type="card"
        size="small"
        defaultActiveKey="0"
        tabBarGutter={10}
        items={itemTabs}
      />
    </>
  );
};

export default BulkUploadInsurer;
