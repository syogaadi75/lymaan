import {Button, Spin} from "antd";
import {useState} from "react";
import {AiOutlineCheckCircle} from "react-icons/ai";

const DownloadTemplate: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [completeDownload, setCompleteDownload] = useState(false);

  const handleDownload = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setCompleteDownload(true);

      const link = document.createElement("a");
      link.download = "template_database_adjuster.xlsx";
      link.href = "/file_template/template_database_adjuster.xlsx";
      link.click();

      setTimeout(() => {
        setCompleteDownload(false);
      }, 1000);
    }, 1000);
  };
  return (
    <ul className="flex flex-wrap flex-col gap-5 font-medium">
      <li className="flex flex-col gap-3">
        <span>1. Download Template CSV Adjuster</span>
        <Button
          type="ghost"
          className={`w-fit flex items-center border-primary-500 text-primary ml-3 px-6 py-4 font-medium hover:text-white hover:bg-primary-500 text-xs`}
          onClick={handleDownload}
          loading={isLoading}
          icon={
            isLoading ? (
              <Spin />
            ) : completeDownload ? (
              <AiOutlineCheckCircle size={14} />
            ) : null
          }>
          {isLoading
            ? "Downloading CSV"
            : completeDownload
            ? "Done Downloading CSV"
            : "Download Template"}
        </Button>
      </li>
      <li>2. Adjust the data you want to add with the downloaded template.</li>
      <li>3. Go to the 'Upload' tab to upload the template</li>
    </ul>
  );
};

export default DownloadTemplate;
