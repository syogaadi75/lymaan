import {InputNumber, InputNumberProps} from "antd";
import cx from "classnames";
import {Fragment, useEffect, useState} from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormSetValue,
  Control,
  useWatch,
} from "react-hook-form";

type InputProps<T extends FieldValues = UniversalType> = {
  name: string;
  control?: Control<T>;
  currency?: "usd" | "idr";
  defaultValue?: number;
  label: string;
  onChange?: (value: number | string) => void;
  errors?: FieldErrors<T>;
  customError?: string | null;
  labelclassName: string;
  isRequired?: boolean;
  typeFlex?: "column" | "row";
  setValue?: UseFormSetValue<T>;
  value?: number;
  fullwidth?: boolean;
} & InputNumberProps;

const InputNumberField = ({
  name,
  currency,
  setValue,
  control,
  onChange,
  label,
  errors,
  labelclassName = "text-sm",
  isRequired,
  typeFlex = "column",
  className,
  customError,
  defaultValue,
  value,
  fullwidth,
  readOnly,
  ...rest
}: InputProps) => {
  const [inputValue, setInputValue] = useState<number>(defaultValue ?? 0);

  if (control) {
    const valueInput = useWatch({control, name: name});

    useEffect(() => {
      setInputValue(valueInput ?? 0);
    }, [valueInput]);
  }

  const currencyFormatter = () => {
    const result = new Intl.NumberFormat(
      currency == "idr" || !currency ? "id-ID" : "en-US",
      {
        style: "currency",
        currency: currency == "idr" || !currency ? "IDR" : "USD",
      },
    ).format(Number(inputValue));

    return result;
  };

  const currencyParser = (val?: string) => {
    try {
      const group = new Intl.NumberFormat(
        currency == "idr" || !currency ? "id-ID" : "en-US",
      )
        .format(1111)
        .replace(/1/g, "");
      const decimal = new Intl.NumberFormat(
        currency == "idr" || !currency ? "id-ID" : "en-US",
      )
        .format(1.1)
        .replace(/1/g, "");

      val = val ?? inputValue.toString().replace(".", decimal);

      if (typeof val === "string" && !val.length) {
        val = "0.0";
      }

      let reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
      reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
      reversedVal = reversedVal.replace(/[^0-9.]/g, "");

      const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
      const needsDigitsAppended = digitsAfterDecimalCount > 2;

      if (needsDigitsAppended) {
        reversedVal = (
          parseFloat(reversedVal) * Math.pow(10, digitsAfterDecimalCount - 2)
        ).toString();
      }

      return isNaN(parseFloat(reversedVal)) ? 0 : parseFloat(reversedVal);
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  const [isChangedCurrency, setIsChangedCurrency] = useState(false);

  useEffect(() => {
    const newValue = currencyParser();
    setInputValue(newValue + 1);
    setIsChangedCurrency(true);
  }, [currency]);

  useEffect(() => {
    if (value) setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (isChangedCurrency) {
      const newValue = currencyParser();
      setInputValue(newValue - 1);

      setIsChangedCurrency(false);
    }
  }, [isChangedCurrency]);

  return (
    <Fragment>
      <fieldset
        className={cx({
          "flex flex-col space-y-1": typeFlex === "column",
          "flex items-center": typeFlex === "row",
        })}>
        {label && (
          <label htmlFor={name} className={labelclassName}>
            {label}{" "}
            {isRequired && <span className="text-red-500"> &#42; </span>}
          </label>
        )}
        <InputNumber
          readOnly={readOnly}
          value={inputValue}
          className={cx(
            "border border-solid border-[#d6d6d6] rounded-md transition-colors hover:border-[#40a9ff] focus:outline-[#40a9ff] focus:border-[#40a9ff] focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]",
            {"w-full": fullwidth},
            {"bg-gray-50": readOnly},
            className,
          )}
          size="large"
          formatter={() => {
            const res = currencyFormatter();
            return res;
          }}
          parser={(value) => {
            const res = currencyParser(value);
            return res;
          }}
          autoComplete="off"
          {...(typeof setValue !== "undefined" && name
            ? {
                onChange: (value) => {
                  value = parseFloat(value?.toString() ?? "0");

                  setInputValue(value);
                  setValue(name, value);
                  onChange && onChange(value);
                },
              }
            : {})}
          // {...(typeof register !== "undefined" ? register(name as string) : {})}
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

export default InputNumberField;
