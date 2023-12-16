import {Button, Upload} from "antd";
import type {RcFile, UploadFile, UploadProps} from "antd/es/upload/interface";
import React, {useState} from "react";
import cx from "classnames";
import {ReactComponent as ImageUpIcon} from "public/icons/image-up.svg";

/**
 * TODO :
 * - Add action props to Upload components when API is ready.
 */
const UploadUserAvatar = ({
  containerClassName,
  draggableClassName,
  buttonClassName,
  withButton = false,
}: {
  containerClassName?: string;
  draggableClassName?: string;
  buttonClassName?: string;
  withButton?: boolean;
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({fileList: newFileList}) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div
      className={cx(
        "w-44",
        {"flex flex-col justify-center items-center gap-4": withButton},
        containerClassName,
      )}>
      <Upload
        beforeUpload={() => false}
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        className={cx("w-full h-32 m-auto", draggableClassName)}
        maxCount={1}
        accept="image/*">
        {fileList.length < 1 && (
          <div className="flex flex-col justify-center items-center">
            <ImageUpIcon className="w-10 h-10" />
            <span className="font-normal text-xs text-primary-100">
              Drag file to upload
            </span>
          </div>
        )}
      </Upload>
      {withButton && (
        <Upload
          beforeUpload={() => false}
          fileList={fileList}
          showUploadList={false}
          onChange={onChange}
          onPreview={onPreview}
          maxCount={1}
          accept="image/*">
          <Button
            htmlType="button"
            className={cx(
              "w-36 h-8 bg-primary-500 text-white font-medium text-xs",
              buttonClassName,
            )}>
            Choose file
          </Button>
        </Upload>
      )}
    </div>
  );
};

export default UploadUserAvatar;
