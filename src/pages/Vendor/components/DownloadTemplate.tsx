import {useEffect, useState} from "react";
import cx from "classnames";
import {Button} from "antd";
import {useNotification} from "hooks/atom/useAtom";
import {FaFileExcel} from "react-icons/fa";
import {AiFillCheckCircle} from "react-icons/ai";

const DownloadTemplate = () => {
  const {setNotification} = useNotification();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloadSuccess, setIsDownloadSuccess] = useState<boolean>(false);
  const handleDownload = () => {
    const file = "/file_template/template_database_vendor.xlsx";
    const filename = "template_database_vendor.xlsx";
    const link = document.createElement("a");

    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        if (link && file && filename) {
          link.href = file;
          link.download = filename;
          link.click();
          setNotification({
            notificationType: "success",
            notificationTitle: "Success download template",
            notificationDescription: "Template downloaded successfully!",
          });
          setIsDownloadSuccess(true);
        }
        setIsLoading(false);
      }, 1000);
    }, 1000);
  };

  useEffect(() => {
    if (isDownloadSuccess) {
      setTimeout(() => {
        setIsDownloadSuccess(false);
      }, 2000);
    }
  }, [isDownloadSuccess]);
  return (
    <ol className="space-y-3 list-decimal list-inside">
      <li>
        <span>Download Template Excel Insured Data</span>
        <Button
          type="link"
          loading={isLoading}
          onClick={handleDownload}
          className={cx(
            "w-fit ml-3 mt-3 mb-4 px-[20px] py-[17.5px] flex items-center font-medium border-1 rounded-lg",
            {
              "border-green-600 text-green-600": isDownloadSuccess,
              "border-primary-300 text-primary-300": isLoading,
              "border-primary-600 text-primary-600 text-[13.5px]": !isLoading,
            },
          )}>
          {isLoading ? (
            "Downloading Template"
          ) : isDownloadSuccess ? (
            <span className="flex items-center gap-3">
              <AiFillCheckCircle /> Success Download Template
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <FaFileExcel /> Download Template
            </span>
          )}
        </Button>
      </li>
      <li>Adjust the data you want to add with the downloaded template</li>
      <li>Go to the 'Upload' tab to upload the template</li>
    </ol>
  );
};

export default DownloadTemplate;
