import {Button, Tooltip} from "antd";
import React from "react";
import cx from "classnames";

type IconButtonProps = {
  tooltip?: string;
  color?: "primary" | "danger" | "warning";
  onClick?: () => void;
  htmlType?: "button" | "submit" | "reset" | undefined;
  type?:
    | "primary"
    | "default"
    | "link"
    | "text"
    | "ghost"
    | "dashed"
    | undefined;
};

const IconButton: React.FC<IconButtonProps> = ({
  tooltip,
  children,
  onClick,
  color,
  htmlType,
  type,
}) => {
  return (
    <Tooltip title={tooltip}>
      <Button
        htmlType={htmlType ?? "button"}
        type={type ?? "default"}
        className={cx("rounded-lg p-[6px] w-9 h-9 border-0 text-white", {
          "bg-primary-100 hover:bg-primary-200":
            color == "primary" || color == undefined,
          "bg-[#c99898] hover:bg-[#b28282]": color == "danger",
          "bg-[#C9C498] hover:bg-[#a19e7d]": color == "warning",
        })}
        onClick={onClick}>
        {children}
      </Button>
    </Tooltip>
  );
};

export default IconButton;
