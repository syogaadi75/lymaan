import {useState} from "react";
import cx from "classnames";
import {Button, notification} from "antd";

const DownloadTemplate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    type: "success" | "info" | "warning" | "error",
    notificationDescription: string,
    notificationTitle: string,
  ) => {
    api[type]({
      message: notificationTitle,
      description: notificationDescription,
      placement: "bottomRight",
    });
  };

  const handleDownloadTemplate = () => {
    const file = "/file_template/broker_template_database.xlsx";
    const filename = "broker_template_database.xlsx";
    const link = document.createElement("a");

    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        if (link && file && filename) {
          link.download = filename;
          link.href = file;
          link.click();
          openNotification(
            "success",
            "Success downloaded CSV template for bulk upload brokers",
            "Success download",
          );
        }
        setIsLoading(false);
      }, 1000);
    }, 1000);
  };

  return (
    <>
      {contextHolder}
      <ol className="list-decimal list-inside space-y-3">
        <li>
          <span>Download Template CSV Brokers Data</span>
          <Button
            type="link"
            loading={isLoading}
            onClick={handleDownloadTemplate}
            className={cx(
              "w-fit ml-3 mt-3 mb-4 px-8 py-4 flex items-center font-medium border-1",
              {
                "border-primary-600 text-primary-600 ": !isLoading,
                "border-primary-300 text-primary-300": isLoading,
              },
            )}>
            {isLoading ? "Downloading" : "Download Template"}
          </Button>
        </li>
        <li>
          <span>
            Adjust the data you want to add with the downloaded template
          </span>
        </li>
        <li>
          <span>Go to the 'Upload' tab to upload template</span>
        </li>
      </ol>
    </>
  );
};

export default DownloadTemplate;
