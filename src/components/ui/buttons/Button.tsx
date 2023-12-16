import React from "react";
import {Button as ButtonAntd, ButtonProps as ButtonPropsAntd} from "antd";
import cx from "classnames";

type ButtonProps = {
  disabled?: boolean;
  color?: "primary" | "secondary" | "danger" | "warning" | "outline";
} & ButtonPropsAntd;

const Button: React.FC<ButtonProps> = ({
  children,
  color,
  className,
  disabled,
  ...rest
}) => {
  return (
    <ButtonAntd
      className={cx(
        "text-base font-medium flex items-center justify-center border-0",
        disabled
          ? {"bg-gray-300 text-white hover:text-white": true}
          : {
              "bg-primary-400 hover:bg-primary-500 text-white hover:text-white":
                color == "primary" || color == null,
              "bg-primary-200 hover:bg-primary-300 text-white hover:text-white":
                color == "secondary",
              "bg-red-500 hover:bg-red-600 text-white hover:text-white":
                color == "danger",
              "border-[1px] border-primary-400 text-primary-500 hover:bg-gray-100":
                color == "outline",
            },
        className,
      )}
      disabled={disabled}
      {...rest}>
      {children}
    </ButtonAntd>
  );
};

export default Button;
