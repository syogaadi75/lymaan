import {useEffect, useRef, useState} from "react";
import {useDropzone} from "react-dropzone";
import * as XLSX from "xlsx";

import {ColumnsType} from "antd/es/table";
import {Table, Button, PaginationProps} from "antd";

import {BiTrash} from "react-icons/bi";
import {RiDragDropLine} from "react-icons/ri";
import {AiOutlineClose} from "react-icons/ai";
import {ReactComponent as IconCSV} from "public/icons/csv-logo.svg";
import {ReactComponent as ImageUpload} from "public/icons/image-up.svg";

import {useAtom} from "jotai";
import {formatDate} from "utils";
import {useNotification} from "hooks/atom/useAtom";
import {BrokersApiType, UploadBulkBrokersType} from "interfaces";
import {extractedBrokersAtom, uploadedFileAtom} from "./BrokerLists";

interface UploadBulkType {
  setValue: (fieldName: string, fieldValue: File) => void;
}

interface BrokersXLSXDataRow {
  name: string;
  company: string;
  address: string;
  phone: string;
  affiliation: string;
}

const UploadBulkBrokers = ({setValue}: UploadBulkType) => {
  const {setNotification} = useNotification();
  const inputBrokerRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [uploadedFile, setUploadedFile] = useAtom(uploadedFileAtom);
  const [extractedBrokers, setExtractedBrokers] = useAtom(extractedBrokersAtom);

  const countFileSize = (fileSize: number): string => {
    return (fileSize / 1024).toFixed(2) + "KB";
  };

  const handleSelectFile = () => {
    if (inputBrokerRef.current) {
      return inputBrokerRef.current.click();
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setExtractedBrokers([]);
  };

  const deleteBroker = (brokerId: number) => {
    const targetBrokerId = extractedBrokers.findIndex(
      (broker) => broker.id === brokerId,
    );

    if (targetBrokerId !== -1 && targetBrokerId < extractedBrokers.length) {
      extractedBrokers.splice(targetBrokerId, 1);
    }

    const modifiedExtractedBrokers = [...extractedBrokers];
    setExtractedBrokers(modifiedExtractedBrokers);
  };

  const onDropBrokers = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    setValue("brokersInputFile", file);

    reader.onload = (event) => {
      const binaryString = event.target?.result as string;
      const workbook = XLSX.read(binaryString, {type: "binary"});
      const sheetname = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetname];
      const xlsxData = XLSX.utils.sheet_to_json(worksheet);

      // set allowed upload xlsx header arrays
      const allowedXLSXHeaders = [
        "name",
        "company",
        "address",
        "phone",
        "affiliation",
      ];

      const headerIsAllowed: boolean =
        xlsxData.length >= 1 &&
        allowedXLSXHeaders.every((header) =>
          Object.keys(xlsxData[0] as BrokersXLSXDataRow).includes(header),
        );

      if (!headerIsAllowed) {
        setNotification({
          notificationType: "error",
          notificationTitle: "Error parsing XLSX file",
          notificationDescription:
            "Cannot parse XLSX file, please upload with template provided",
        });
      } else {
        const dataArray: BrokersApiType[] =
          xlsxData.map((rowData: any, index: number) => {
            return {
              id: index,
              no: index + 1,
              name: rowData.name,
              address: rowData.address,
              company: rowData.company,
              phone: rowData.phone,
              affiliation: rowData.affiliation,
              created_at: formatDate(new Date()),
            };
          }) ?? [];

        setNotification({
          notificationType: "success",
          notificationTitle: "Success Upload File",
          notificationDescription: "Success uploading and read file content!",
        });
        setExtractedBrokers(dataArray);
      }
    };
    reader.readAsBinaryString(file);
    setUploadedFile(file);
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop: onDropBrokers,
    noClick: true,
    multiple: true,
    // onDropAccepted: '.xlsx'
  });

  const columns: ColumnsType<UploadBulkBrokersType> = [
    {
      title: "No",
      dataIndex: "no",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Name",
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
      title: "Insurer Name",
      dataIndex: "company",
      sorter: {
        compare: (a, b) => a.company.localeCompare(b.company),
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
      title: "Affiliation",
      dataIndex: "affiliation",
      sorter: {
        compare: (a, b) => a.affiliation.localeCompare(b.affiliation),
      },
    },
    // {title: "Action", dataIndex: "action"},
  ];

  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement,
  ) => {
    if (type === "prev") {
      return <a>Previous</a>;
    }
    if (type === "next") {
      return <a>Next</a>;
    }
    return originalElement;
  };

  const dataFrom = (brokers: BrokersApiType[]): UploadBulkBrokersType[] => {
    return brokers.map((data, index: number) => {
      return {
        key: data.id,
        id: data.id,
        no: index + 1,
        name: data.name,
        address: data.address,
        company: data.company,
        created_at: formatDate(new Date(data.created_at)),
        affiliation: data.affiliation,
        phone: data.phone,
        action: (
          <Button
            type="ghost"
            icon={<BiTrash size={24} />}
            onClick={() => deleteBroker(data.id)}
            className="mx-auto flex justify-center items-center bg-primary-100 text-white"
          />
        ),
      };
    });
  };

  const dataSource: UploadBulkBrokersType[] = dataFrom(extractedBrokers);

  useEffect(() => {
    console.log({uploadedFile, extractedBrokers});
  }, [uploadedFile, extractedBrokers]);

  return (
    <div className="w-full flex flex-col gap-4">
      <h1>Please upload the complete template file</h1>
      <div className="flex flex-col items-center gap-4 border border-dashed rounded-[0.35rem] border-primary-100 h-fit p-5">
        <div {...getRootProps()} className="flex flex-col items-center gap-2">
          <input
            {...getInputProps()}
            ref={inputBrokerRef}
            name="brokersInputFile"
            accept=".xlsx"
          />
          {isDragActive ? (
            <>
              <RiDragDropLine size={36} className="text-primary-100" /> Drop
              Files here
            </>
          ) : uploadedFile ? (
            <div className="flex flex-col items-center space-y-7 my-3">
              <div className="flex items-center gap-3">
                <IconCSV />
                <span>
                  <p className="text-xs">{uploadedFile.name}</p>
                  <p className="text-xs">{countFileSize(uploadedFile.size)}</p>
                </span>
                <Button
                  type="ghost"
                  icon={<AiOutlineClose />}
                  onClick={handleClearFile}
                />
              </div>
              <Button
                type="ghost"
                className="text-[14px] bg-primary-500 text-white w-fit h-fit px-24"
                onClick={handleSelectFile}>
                Change file
              </Button>
            </div>
          ) : (
            <>
              <ImageUpload />
              <div className="flex flex-col items-center gap-1.5 mt-1.5">
                <p className="text-[16px] text-primary-100">
                  Drag and drop files here
                </p>
                <p className="text-[11px] text-gray-300 mb-2.5">
                  Supported format : .xlsx
                </p>
                <Button
                  type="ghost"
                  className="text-md bg-primary-500 text-white w-fit h-fit px-24"
                  onClick={handleSelectFile}>
                  Select file
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {extractedBrokers.length > 1 ? (
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
          pagination={{
            position: ["bottomCenter"],
            itemRender: itemRender,
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
        />
      ) : null}
    </div>
  );
};

export default UploadBulkBrokers;
