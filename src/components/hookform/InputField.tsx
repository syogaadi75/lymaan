import cx from "classnames";
import {Fragment, InputHTMLAttributes} from "react";
import {FieldErrors, FieldValues, UseFormRegister} from "react-hook-form";

type InputProps<T extends FieldValues = UniversalType> = {
  label: string;
  errors: FieldErrors<T>;
  customError: string | null;
  labelclassName: string;
  isRequired: boolean;
  typeFlex: "column" | "row";
  register: UseFormRegister<T>;
} & InputHTMLAttributes<HTMLInputElement>;

const InputField = ({
  register,
  name,
  label,
  errors,
  labelclassName = "text-sm",
  isRequired,
  typeFlex = "column",
  type,
  className,
  maxLength,
  customError,
  ...rest
}: Partial<InputProps>) => {
  return (
    <Fragment>
      <fieldset
        className={cx("mb-3", {
          "flex flex-col space-y-1": typeFlex === "column",
          "flex items-center": typeFlex === "row",
        })}>
        {label && (
          <label htmlFor={name} className={labelclassName}>
            {label}{" "}
            {isRequired && <span className="text-red-500"> &#42; </span>}
          </label>
        )}
        <input
          type={type}
          className={cx(
            "border border-solid border-[#d6d6d6] rounded-md py-2 px-2 transition-colors hover:border-[#40a9ff] focus:outline-[#40a9ff] focus:border-[#40a9ff] focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]",
            className,
          )}
          maxLength={type !== "number" ? 40 : maxLength}
          onWheel={(ev) => ev.currentTarget.blur()}
          autoComplete="off"
          {...(typeof register !== "undefined" ? register(name as string) : {})}
          {...rest}
        />
        {(errors && errors[name as UniversalType]) ||
        customError ||
        errors?.message ? (
          <p className="mt-1 text-left text-[12px] text-red-500 opacity-80">
            {(errors && errors[name as UniversalType]?.message) ||
              customError ||
              errors?.message}
          </p>
        ) : null}
      </fieldset>
    </Fragment>
  );
};

export default InputField;
