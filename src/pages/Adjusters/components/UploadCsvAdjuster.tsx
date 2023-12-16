import {useRef} from "react";
import {useDropzone} from "react-dropzone";

import {Button, PaginationProps, Space, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {ReactComponent as ImageUpload} from "public/icons/image-up.svg";
import {ReactComponent as IconCSV} from "public/icons/csv-logo.svg";
import {AiOutlineClose} from "react-icons/ai";
import {AdjusterTypeColumnTable, AdjusterTypeTable} from "..";
import {BiTrash} from "react-icons/bi";

interface UploadedFilesType {
  size: number;
  name: string;
}

const tableColumn: ColumnsType<AdjusterTypeTable> = [
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
    sorter: {compare: (a, b) => a.address.localeCompare(b.address)},
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: {compare: (a, b) => a.email.localeCompare(b.email)},
  },
  {
    title: "Date Joined",
    dataIndex: "join_date",
    sorter: {compare: (a, b) => a.join_date.localeCompare(b.join_date)},
  },
  {
    title: "Phone",
    dataIndex: "phone",
    sorter: {compare: (a, b) => a.phone.localeCompare(b.phone)},
  },
  {title: "Action", dataIndex: "action"},
];

const UploadCsvAdjuster = ({
  setUploadedFiles,
  setExtractedCSV,
  uploadedFiles,
  tableDataSource,
}: {
  setUploadedFiles: (file: File[]) => void;
  setExtractedCSV: (extractedCsv: AdjusterTypeTable[]) => void;
  uploadedFiles: File[];
  tableDataSource: AdjusterTypeTable[];
}) => {
  const inputAdjusterRef = useRef<HTMLInputElement>(null);

  const convertCsvToJSON = (csvText: string): AdjusterTypeTable[] => {
    const lines = csvText.split("\r\n");
    const headers = lines[0].split(";");
    const jsonArray: AdjusterTypeTable[] = [];

    const formatDateAdjuster = (dateValue: Date) => {
      return dateValue.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(";");
      if (values.length !== headers.length) {
        console.warn(
          `Skipping line ${i + 1} due to inconsistent number of values`,
        );
        continue;
      }

      const row = {
        id: parseInt(values[0]),
        no: parseInt(values[0]),
        name: values[1],
        address: values[2],
        email: values[3],
        phone: values[4],
        join_date: formatDateAdjuster(new Date(values[5])),
      };
      jsonArray.push(row);
    }
    return jsonArray;
  };

  const handleSelectFile = () => {
    if (inputAdjusterRef.current) {
      inputAdjusterRef.current.click();
    }
  };

  const handleClearCsv = () => {
    setUploadedFiles([]);
    setExtractedCSV([]);
  };

  const handleSelectFileAgain = () => {
    handleClearCsv();
    if (inputAdjusterRef.current) {
      inputAdjusterRef.current.click();
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const csvText = reader.result;
      const JSON_array = convertCsvToJSON(csvText as string);
      setExtractedCSV(JSON_array);
    };
    reader.readAsText(file);
    setUploadedFiles([file]);
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: true,
  });

  const handleDeleteAdjuster = (adjusterId: number) => {
    tableDataSource.splice(adjusterId + 1, 1);
    const modifiedData = [...tableDataSource];
    setExtractedCSV(modifiedData);
  };

  const dataFrom = (
    adjusters: AdjusterTypeTable[],
  ): AdjusterTypeColumnTable[] => {
    return adjusters.map((data, index: number) => {
      return {
        key: data.id,
        id: data.id,
        no: index,
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        join_date: data.join_date,
        action: (
          <>
            <Button
              type="ghost"
              className="bg-primary-200 text-white"
              icon={
                <BiTrash
                  size={22}
                  onClick={() => handleDeleteAdjuster(data.id)}
                />
              }
            />
          </>
        ),
      };
    });
  };

  const dataSource: AdjusterTypeColumnTable[] = dataFrom(tableDataSource);

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
            name="upload_csv"
            ref={inputAdjusterRef}
            accept="text/csv, .csv"
          />
          {isDragActive ? (
            <>Drop files here</>
          ) : uploadedFiles.length >= 1 ? (
            uploadedFiles.map((file: UploadedFilesType, idx) => (
              <div className="flex items-center gap-3" key={idx}>
                <IconCSV />
                <div className="flex flex-col">
                  <p className="text-xs">{file.name}</p>
                  <p className="text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <Button
                  type="ghost"
                  icon={<AiOutlineClose />}
                  onClick={handleClearCsv}
                />
              </div>
            ))
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
          <Button
            onClick={
              uploadedFiles.length < 1
                ? handleSelectFile
                : handleSelectFileAgain
            }
            type="ghost"
            className="bg-primary-500 text-white w-fit h-fit text-[10px] py-[0.4rem] px-20">
            {uploadedFiles.length < 1 ? "Upload File" : "Change File"}
          </Button>
        </div>
      </div>
      {tableDataSource.length > 1 ? (
        <Table
          columns={tableColumn}
          dataSource={dataSource}
          pagination={{
            position: ["bottomCenter"],
            itemRender: itemRender,
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "25", "50", "75", "100"],
          }}
        />
      ) : null}
    </Space>
  );
};

export default UploadCsvAdjuster;
