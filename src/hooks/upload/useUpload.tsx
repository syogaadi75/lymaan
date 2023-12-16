import {UploadProps, message} from "antd";
import Upload, {RcFile, UploadChangeParam, UploadFile} from "antd/es/upload";
import {baseUrl} from "constans/config";
import {ReactElement, useCallback, useRef, useState} from "react";
import jsCookie from "js-cookie";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const useUpload = (component: ReactElement) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const refUpload = useRef<HTMLDivElement>(null);
  const token = jsCookie.get("auth_token");

  const reset = useCallback(() => setImageUrl(null), []);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    return isJpgOrPng;
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, () => {
        setLoading(false);

        setImageUrl(info.file.response?.image_name);
      });
    }
  };

  const uploadComponent = (
    <Upload
      ref={refUpload}
      name="image"
      listType="picture-card"
      showUploadList={false}
      action={`${baseUrl}/api/la/upload-image`}
      headers={{
        Authorization: token ? "Bearer " + token : "",
      }}
      beforeUpload={beforeUpload}
      onChange={handleChange}>
      <></>
      {component}
    </Upload>
  );

  return {reset, loading, imageUrl, uploadComponent};
};
