import React, {InputHTMLAttributes, useEffect, useState} from "react";
import {message, Upload as UploadAntd} from "antd";
import type {UploadChangeParam} from "antd/es/upload";
import type {
  RcFile,
  UploadFile,
  UploadProps as UploadPropsAntd,
} from "antd/es/upload/interface";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  Control,
  useWatch,
} from "react-hook-form";
import jsCookie from "js-cookie";
import {InputField} from "components/hookform";
import {baseUrl} from "constans/config";
import {AiOutlineLoading, AiOutlinePlus} from "react-icons/ai";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  return isJpgOrPng;
};

type UploadProps<T extends FieldValues = UniversalType> = {
  name: string;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
} & InputHTMLAttributes<HTMLInputElement>;

const Upload = ({setValue, name, register, errors, control}: UploadProps) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const token = jsCookie.get("auth_token");

  const valueInput = useWatch({control, name: name});

  useEffect(() => {
    if (valueInput == "") setImageUrl(undefined);
  }, [valueInput]);

  const handleChange: UploadPropsAntd["onChange"] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });

      setValue(name, info.file.response?.image_name);
    }
  };

  const uploadButton = (
    <div className="flex flex-col items-center">
      {loading ? <AiOutlineLoading /> : <AiOutlinePlus />}
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  );

  return (
    <>
      <UploadAntd
        name="image"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={`${baseUrl}/api/la/upload-image`}
        headers={{
          Authorization: token ? "Bearer " + token : "",
        }}
        beforeUpload={beforeUpload}
        onChange={handleChange}>
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{width: "100%"}} />
        ) : (
          uploadButton
        )}
      </UploadAntd>
      <InputField
        type="hidden"
        {...{name, register, errors}}
        name={name}
        register={register}
      />
    </>
  );
};

export default Upload;
