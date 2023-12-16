import {useState} from "react";
import {Breadcrumb, Button, Tabs} from "antd";
import UploadCsvAdjuster from "./UploadCsvAdjuster";
import DownloadTemplate from "./DownloadTemplate";
import {AdjusterTypeTable} from "..";

const BulkUploadAdjuster = ({
  closeBulkUpload,
}: {
  closeBulkUpload: () => void;
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extractedCsv, setExtractedCsv] = useState<AdjusterTypeTable[]>([]);

  const breadcrumbs = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Database",
      href: "/adjusters",
    },
    {
      title: "Adjusters",
      href: "/adjusters",
    },
    {title: "Bulk Upload Of Adjuster"},
  ];

  const itemTabs = new Array(2).fill(null).map((_, i) => {
    const id = String(i + 1);
    return {
      key: id,
      label: id === "2" ? "Upload" : "Download",
      children:
        id === "2" ? (
          <UploadCsvAdjuster
            setExtractedCSV={setExtractedCsv}
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
            tableDataSource={extractedCsv}
          />
        ) : (
          <DownloadTemplate />
        ),
    };
  });
  return (
    <div className="pt-4 px-2">
      <h1 className="text-2xl font-medium pb-2">Bulk Upload Of Adjuster</h1>
      <Breadcrumb items={breadcrumbs} separator=">" />
      <div className="my-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg p-4">
        <Tabs type="card" size="small" items={itemTabs} tabBarGutter={10} />
      </div>
      {extractedCsv.length > 1 ? (
        <div className="flex flex-wrap justify-end gap-3 pt-5 pb-10">
          <Button
            onClick={closeBulkUpload}
            type="ghost"
            className="border-primary-600 text-primary-700 px-24 py-2 h-fit">
            Cancel
          </Button>
          <Button
            type="ghost"
            className="bg-primary-600 text-white px-12 py-2 h-fit">
            Upload File To Database
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default BulkUploadAdjuster;
