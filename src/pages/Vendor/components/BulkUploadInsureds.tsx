import * as XLSX from "xlsx";
import {useRef, useState} from "react";
import {useDropzone} from "react-dropzone";

import {ReactComponent as ImageUpload} from "public/icons/image-up.svg";
import {AiFillFileExcel, AiOutlineClose} from "react-icons/ai";
import {FaFileUpload} from "react-icons/fa";

import {Button, Divider, PaginationProps, Space, Table} from "antd";
import {ColumnsType} from "antd/es/table";

import {VendorData, VendorMainData, VendorTableDataUpload} from "interfaces";
import {useNotification} from "hooks/atom/useAtom";
import {uploadedExcelAtom, useUploadedExcel} from "../ImportVendor";
import {useAtom} from "jotai";

type uploadedExcelInitState = {
  file: File | undefined;
  contents: VendorData[];
};

type InsuredXLSXContent = {
  name: string;
  address: string;
  type_vendor: string;
  phone: string;
  email: string;
  pic: string;
  website: string;
};

const BulkUploadInsureds = () => {
  const {setNotification} = useNotification();
  const inputRef = useRef<HTMLInputElement>(null);
  const {setFileExcel, setExtractedContents} = useUploadedExcel();
  const [uploadedExcel, setUploadedExcel] = useAtom(uploadedExcelAtom);

  const extractDataExcel = (binaryString: string) => {
    const workbook = XLSX.read(binaryString, {type: "binary"});
    const sheetname = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetname];
    const XLSXData = XLSX.utils.sheet_to_json(worksheet);
    const allowedFileHeaders = [
      "name",
      "address",
      "type_vendor",
      "phone",
      "email",
      "pic",
      "website",
    ];
    const isAllowedHeaders =
      XLSXData.length > 0 &&
      allowedFileHeaders.every((header) =>
        Object.keys(XLSXData[0] as InsuredXLSXContent).includes(header),
      );
    if (!isAllowedHeaders) {
      setNotification({
        notificationType: "error",
        notificationTitle: "Error read excel",
        notificationDescription: (
          <p>
            Reading excel error
            <span>: {allowedFileHeaders.map((header) => ` ${header}, `)}</span>
          </p>
        ),
      });
    }
    const extractedData: VendorMainData[] =
      XLSXData.map((rowData: any, index: number) => {
        return {
          id: index,
          name: rowData.name,
          address: rowData.address,
          phone: rowData.phone,
          pic: rowData.pic,
          website: rowData.website,
          type_vendor: rowData.type_vendor,
          email: rowData.email,
        };
      }) ?? [];
    return extractedData;
  };

  const onDropFile = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const binaryString = e.target?.result as string;
      const extractedData = extractDataExcel(binaryString);
      setExtractedContents(extractedData);
    };
    reader.readAsBinaryString(file);
    setFileExcel(file);
  };

  const {getRootProps, getInputProps, isDragActive, acceptedFiles} =
    useDropzone({
      noClick: true,
      multiple: true,
      noKeyboard: true,
      onDrop: onDropFile,
    });

  const handleSelectExcel = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleClearExcel = () => {
    acceptedFiles.length = 0;
    acceptedFiles.splice(0, acceptedFiles.length);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setExtractedContents([]);
    setFileExcel(undefined);
  };

  const tableColumn: ColumnsType<VendorMainData> = [
    {
      title: "No",
      dataIndex: "id",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Insured Name",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
      },
    },
    {
      title: "Insured Address",
      dataIndex: "address",
      sorter: {
        compare: (a, b) => a.address.localeCompare(b.address),
      },
    },
    {
      title: "Contact",
      dataIndex: "phone",
      sorter: {
        compare: (a, b) => a.phone.localeCompare(b.phone),
      },
    },
    {
      title: "PIC",
      dataIndex: "pic",
      sorter: {
        compare: (a, b) => a.pic.localeCompare(b.pic),
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
      title: "Website",
      dataIndex: "website",
      sorter: {
        compare: (a, b) => a.website.localeCompare(b.website),
      },
    },
  ];

  const dataSource: VendorTableDataUpload[] =
    uploadedExcel.contents.length >= 1
      ? uploadedExcel.contents.map((data, index) => ({
          ...data,
          key: index + 1,
        }))
      : [];

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
      <label htmlFor="excelFile">
        Please upload the complete template file
      </label>
      <div className="flex flex-col items-center gap-4 border border-dashed rounded-[0.35rem] border-primary-100 h-fit p-5">
        <div {...getRootProps()} className="flex flex-col items-center gap-2">
          <input
            {...getInputProps()}
            name="excelFile"
            accept=".xlsx"
            ref={inputRef}
          />
          {isDragActive ? (
            <span className="flex flex-col items-center gap-3">
              <FaFileUpload size={28} />
              <h1 className="text-[0.915rem] mb-2">Drop files here</h1>
            </span>
          ) : uploadedExcel.file ? (
            <div className="flex gap-2 items-center mb-3">
              <AiFillFileExcel size={42} className="text-green-600" />
              <div className="flex flex-wrap flex-col">
                <span className="flex items-center">
                  <p className="text-xs">{uploadedExcel.file.name}</p>
                  <p className="text-xs text-gray-300 ml-7">
                    {(uploadedExcel.file.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    type="ghost"
                    className="p-0 ml-7"
                    icon={<AiOutlineClose />}
                    onClick={handleClearExcel}
                  />
                </span>
                <Divider className="mt-[0.1rem] mb-[0.395rem] w-fit bg-gray-400" />
                <p className="text-xs text-gray-300">completed</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center mb-3">
              <ImageUpload width={70} height={70} />
              <p className="text-[1.1rem] text-primary-100">
                Drag and drop files here
              </p>
              <p className="text-[0.915rem] text-gray-300">
                Supported format : .xlsx
              </p>
            </div>
          )}
          <Button
            type="ghost"
            onClick={handleSelectExcel}
            className="bg-primary-500 text-white w-fit h-fit text-[0.9rem] py-[0.4rem] px-28">
            Upload File
          </Button>
        </div>
      </div>
      {uploadedExcel.contents.length >= 1 && (
        <>
          <h1>
            Please verify the accuracy of the data you have uploaded below.
          </h1>
          <Table
            columns={tableColumn}
            dataSource={dataSource}
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              itemRender: itemRender,
              total: dataSource.length,
              showTotal: (total, range) =>
                `showing ${range[0]}-${range[1]} of ${total} items`,
              position: ["bottomCenter"],
              pageSizeOptions: ["5", "10", "20"],
            }}
          />
        </>
      )}
    </Space>
  );
};

export default BulkUploadInsureds;
