import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import {
  Badge,
  Button,
  Col,
  Divider,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Row,
  Slider,
  Space,
  Tooltip,
  message,
} from "antd";
import cx from "classnames";
import moment from "moment";
import TextArea from "antd/es/input/TextArea";
import { TableExpenses } from "./TableExpenses";
import { AiOutlineRight } from "react-icons/ai";

import {
  useGetListSubmitCase,
  useGetListPayments,
  useCreatePayment,
  useGetListCompany,
  useGetCaseExpenses,
  useUpdatePayment,
} from "hooks/query";
import { useDisclosure } from "hooks";
import { InputField } from "components/hookform";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddPaymentSchema,
  AddPaymentFormType,
  CaseResponse,
  ExpensesData,
  PaymentTypeApi,
  defaultApiListOptions,
} from "interfaces";
import { formatNumberPrefixZero } from "utils";
import { Breadcrumb } from "components/ui";
import InputNumberField from "components/hookform/InputNumberField";
import { BsPercent } from "react-icons/bs";

export interface DataTypeExpenses extends ExpensesData {
  key: React.Key;
}

interface AdjusterShareType {
  number: number;
  percentage?: string;
}

const FormPayment = ({
  isView: isView,
  paymentData,
}: {
  isView?: boolean;
  paymentData?: PaymentTypeApi;
}) => {
  const queryClient = useQueryClient();
  const { push } = useHistory();
  const [subtotal, setSubtotal] = useState<number>(0);
  const [ppn, setPpn] = useState<number>(0);
  const [stamp, setStamp] = useState<number>(10000);
  const [tax, setTax] = useState<number>(0);
  const [wht, setWHT] = useState<number>(0);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [sumExpenses, setSumExpenses] = useState<number>(0);
  const [modalAction, setModalAction] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [defaultDate] = useState<Date>(new Date());
  const [caseSelected, setCaseSelected] = useState<
    CaseResponse | null | undefined
  >(null);
  const [adjusterShare, setAdjusterShare] = useState<AdjusterShareType>({
    number: 40,
    percentage: `${40} %`,
  });
  const { data: submitCases } = useGetListSubmitCase(defaultApiListOptions);
  const { data: companyDatas } = useGetListCompany(defaultApiListOptions);
  const { data: paymentDatas } = useGetListPayments(defaultApiListOptions);
  const { data: expensesDatas, refetch: refetchExpenses } = useGetCaseExpenses(
    paymentData?.case_id ?? caseSelected?.id ?? "0",
    (data) => {
      let sum = 0;
      data?.data?.map((item) => {
        sum += parseInt(item.nominal);
      });
      setSumExpenses(sum);
    },
  );

  const { mutate: createPayment } = useCreatePayment();
  const { mutate: updatePayment } = useUpdatePayment(
    paymentData ? paymentData.id : 0,
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, defaultValues },
    getValues,
    control,
  } = useForm<AddPaymentFormType>({
    defaultValues: {
      payment_status: "Proforma",
      tax_base: 0,
      total_amount_due: 0,
      stamp_duty: 10000,
      tax_percentage: 0,
    },
    resolver: yupResolver(AddPaymentSchema),
  });

  const countAmountDue = (share: number, adjustment_fee: number) => {
    return Math.round(((share / 100) * adjustment_fee) / 100) * 100;
  };

  useEffect(() => {
    if (caseSelected) refetchExpenses();
  }, [caseSelected]);

  useEffect(() => {
    if (caseSelected) {
      // Loss Adjuster's Fee
      setValue("currency", caseSelected.currency, { shouldValidate: true });
      setValue("claim_adjustment", caseSelected.claim_adjustment, {
        shouldValidate: true,
      });
      setValue("claim_adjustment_fee", caseSelected.claim_adjustment_fee, {
        shouldValidate: true,
      });
      setValue("portion_100_percent", caseSelected.claim_adjustment_fee, {
        shouldValidate: true,
      });
      const amountDueAdjuster = countAmountDue(
        adjusterShare.number,
        caseSelected.claim_adjustment_fee,
      );
      setValue(
        "amount_due",
        countAmountDue(adjusterShare.number, amountDueAdjuster),
        {
          shouldValidate: true,
        },
      );

      // Expenses
      setValue("expenses_portion", sumExpenses, {
        shouldValidate: true,
      });
      const amountDueExpenses = countAmountDue(
        adjusterShare.number,
        sumExpenses,
      );
      setValue("expenses", amountDueExpenses, {
        shouldValidate: true,
      });

      const subTotal = amountDueAdjuster + amountDueExpenses;
      setValue("subtotal", subTotal, {
        shouldValidate: true,
      });

      setSubtotal(subTotal);
    }
  }, [caseSelected, adjusterShare, sumExpenses, tax]);

  // payment summary
  useEffect(() => {
    // Payment Summary
    const taxBase =
      getValues().amount_due - (getValues().amount_due * tax) / 100;
    setValue("tax_base", !isNaN(taxBase) ? taxBase : 0, {
      shouldValidate: true,
    });

    const wht = (taxBase * 2) / 100;
    setValue("wht", !isNaN(wht) ? wht : 0, {
      shouldValidate: true,
    });

    const totalAmountDue = subtotal + parseFloat(stamp.toString()) - wht + ppn;
    setValue("total_amount_due", totalAmountDue, {
      shouldValidate: true,
    });
  }, [subtotal, stamp, tax, wht, ppn]);

  /**
   * START - Get payment old data
   */

  useEffect(() => {
    if (paymentData && submitCases && companyDatas) {
      setValue("payment_status", paymentData.status);
      setValue("inv_date", paymentData.inv_date);
      setValue("due_date", paymentData.due_date);
      setValue("case_id", paymentData.case_id);
      setValue("company_id", paymentData.company_id);
      setValue("insurer_address", paymentData.company.address);
      setValue("client_reference", paymentData.client_reference);
      setValue("ref_date", paymentData.ref_date);
      setValue("add_information", paymentData.add_information);
      setValue("amount_due", paymentData.amount_due);
      setValue("expenses", paymentData.expenses);

      setStamp(paymentData.stamp_duty);
      setValue("stamp_duty", paymentData.stamp_duty);

      console.log(paymentData.tax_percentage);

      setTax(paymentData.tax_percentage);
      setValue("tax_percentage", paymentData.tax_percentage);
      setValue("tax_base", paymentData.tax_base);
      setValue("subtotal", paymentData.subtotal);

      // set share to adjusterShare
      setAdjusterShare({
        number: paymentData.your_share,
        percentage: `${paymentData.your_share} %`,
      });

      // set case selected
      const caseSelected = submitCases.data.find(
        (item) => item.id === paymentData.case_id,
      );

      if (caseSelected) {
        setCaseSelected(caseSelected);
      }
    }
  }, [paymentData, submitCases, companyDatas]);

  /**
   * END - Get payment old data
   */

  /**
   * START AREA - Breadcrumb and dropdown payment type items
   */

  const breadCrumbItems = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Payment",
      href: "/payment",
    },
    {
      title: (isView ? "View" : paymentData ? "Edit" : "Create") + " Payment",
    },
  ];

  const items: MenuProps["items"] = [
    {
      label: <h1 className="text-lg text-center px-16">Status</h1>,
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <a
          href="#payment_status"
          onClick={() => setValue("payment_status", "Proforma")}>
          <Badge status="warning" />
          <span className="text-lg ml-4">Proforma</span>
        </a>
      ),
      key: "1",
    },
    {
      label: (
        <a
          href="#payment_status"
          onClick={() => setValue("payment_status", "Invoice")}>
          <Badge status="processing" />
          <span className="text-lg ml-4">Invoice</span>
        </a>
      ),
      key: "2",
    },
    { type: "divider" },
    {
      label: (
        <a
          href="#payment_status"
          onClick={() => setValue("payment_status", "Done")}>
          <Badge status="success" />
          <span className="text-lg ml-4">Done</span>
        </a>
      ),
      key: "3",
    },
  ];

  /**
   * END AREA - Breadcrumb and dropdown payment type items
   */

  /**
   * START AREA - form and modal action handler
   */

  const handleUpdateModal = () => {
    onOpen();
    setModalAction("edit_data");
  };

  const handleSaveModal = () => {
    onOpen();
    setModalAction("save_data");
  };

  const handleCancelModal = () => {
    onOpen();
    setModalAction("cancel");
  };

  const handleCloseForm = () => {
    push("/payment");
  };

  /**
   * END AREA - form and modal action handler
   */

  /**
   * START REGION ADD NEW AND EDIT PAYMENT HANDLER
   */

  const handleAddPayment: SubmitHandler<AddPaymentFormType> = (data) => {
    if (paymentData) {
      // get new data payment values and format it
      const newData = {
        status: data.payment_status,
        inv_date: moment(data.inv_date).format("YYYY-MM-DD"),
        due_date: moment(data.due_date).format("YYYY-MM-DD"),
        ref_date: moment(data.ref_date).format("YYYY-MM-DD"),
        company_id: parseInt(data.company_id),
        case_id: parseInt(data.case_id),
        your_share: adjusterShare.number,
        tax_percentage: data.tax_percentage,
        client_reference: data.client_reference,
        add_information: data.add_information,
        currency: data.currency as "idr" | "usd",
        amount_due: data.amount_due,
        expenses: data.expenses,
        tax_base: data.tax_base,
        subtotal: data.subtotal,
        wht: data.wht,
        total_amount_due: data.total_amount_due,
      };
      updatePayment(newData, {
        onSuccess: () => {
          message.success("Success update data!");
          push("/payment");
        },
        onError: (newData) => {
          message.error(JSON.stringify(newData));
        },
      });
    } else {
      createPayment(
        {
          inv_date: moment(data.inv_date).format("YYYY-MM-DD"),
          due_date: moment(data.due_date).format("YYYY-MM-DD"),
          case_id: parseInt(data.case_id),
          company_id: parseInt(data.company_id),
          client_reference: data.client_reference,
          ref_date: moment(data.ref_date).format("YYYY-MM-DD"),
          add_information: data.add_information,
          amount_due: data.amount_due,
          expenses: data.expenses,
          currency: data.currency as "idr" | "usd",
          subtotal: data.subtotal,
          stamp_duty: data.stamp_duty,
          tax_percentage: data.tax_percentage,
          tax_base: data.tax_base,
          wht: data.wht,
          your_share: adjusterShare.number,
          total_amount_due: data.total_amount_due,
          status: data.payment_status,
        },
        {
          onSuccess: () => {
            message.success("Success create payment invoice!");
            queryClient.invalidateQueries("get-list-payments");
            handleCloseForm();
          },
          onError: (data) => {
            alert(JSON.stringify(data));
          },
        },
      );
    }
  };

  /**
   * END REGION ADD NEW AND EDIT PAYMENT HANDLER
   */

  const formatter = (value: number | null | undefined) => `${value}%`;

  const formatInvoiceNumber = (paymentId: number) => {
    let formattedNumber = "";

    switch (true) {
      case paymentId < 10:
        formattedNumber = `000000${paymentId}`;
        break;
      case paymentId < 100:
        formattedNumber = `00000${paymentId}`;
        break;
      case paymentId < 1000:
        formattedNumber = `0000${paymentId}`;
        break;
      case paymentId < 10000:
        formattedNumber = `000${paymentId}`;
        break;
      case paymentId < 100000:
        formattedNumber = `00${paymentId}`;
        break;
      case paymentId < 1000000:
        formattedNumber = `0${paymentId}`;
        break;
      default:
        formattedNumber = `${paymentId}`;
        break;
    }

    return formattedNumber;
  };

  const generateInvoiceNumber = () => {
    const paymentArr = paymentDatas?.data || [];
    const lastPayment = paymentArr[paymentArr?.length - 1]?.id ?? 1;
    const formattedInvoiceNumber = formatNumberPrefixZero(lastPayment);
    return formattedInvoiceNumber;
  };

  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber());
    setValue("inv_number", invoiceNumber, { shouldValidate: true });
  }, [invoiceNumber]);

  const handleSetInvoiceNumber = (
    name: keyof AddPaymentFormType,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const textInput = event.target.value;
    if (!invoiceNumber) {
      setInvoiceNumber(textInput);
    } else {
      setValue(name, textInput, { shouldValidate: true });
    }
  };

  const onChangeDatePicker = (
    name: "inv_date" | "due_date" | "ref_date",
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const dateValue = event.target.value;
    setValue(name, dateValue, {
      shouldValidate: true,
    });
  };

  const handleChangeShare = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === "string") {
      const formattedValue = parseInt(value);
      setAdjusterShare((prevState) => {
        return {
          ...prevState,
          number: formattedValue,
          percentage: `${isNaN(formattedValue) ? 0 : formattedValue} %`,
        };
      });
    }
  };

  const handleCaseNumber = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const caseSelected = submitCases?.data?.find((item) => item.id == value);
    if (caseSelected) {
      setCaseSelected(caseSelected);
    }
  };

  const handleInputNumber = (name: keyof AddPaymentFormType, value: string) => {
    setValue(name, parseInt(value), { shouldValidate: true });
    // setTax(parseInt(value));
  };

  const onChangeNumber = (inputValue: number | null) => {
    if (inputValue) {
      setAdjusterShare((prevState) => {
        return {
          ...prevState,
          number: inputValue,
          percentage: `${inputValue} %`,
        };
      });
    }
  };

  const handleInputAdjuster = (value: string, name: string) => {
    if (!value && name === "amount_due") {
      setValue("amount_due", parseInt(value), {
        shouldValidate: true,
      });
    }
  };

  return (
    <>
      <h1 className="text-2xl">
        {(isView ? "View" : paymentData ? "Edit" : "Add") + " Payment"}
      </h1>
      <Breadcrumb className="mt-2" separator=">" items={breadCrumbItems} />
      <form onSubmit={handleSubmit(handleAddPayment)}>
        <div className="w-full mt-6 mb-16 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
          <div className="pt-5">
            <Space className="flex justify-between items-center px-8 py-2">
              <h1 className="text-xl font-medium">Payment Information</h1>
              <Dropdown.Button
                type="primary"
                size="large"
                className={cx("rounded-lg", {
                  "bg-yellow-500": getValues().payment_status === "Proforma",
                  "bg-blue-500": getValues().payment_status === "Invoice",
                  "bg-green-500": getValues().payment_status === "Done",
                })}
                menu={{
                  items,
                }}
                icon={<AiOutlineRight />}
                trigger={["click"]}
                onClick={(e) => e.preventDefault()}>
                {getValues().payment_status}
              </Dropdown.Button>
            </Space>
            <Divider className="mt-4 mb-0 pt-5 pb-3" />
            <div className="grid grid-cols-2 gap-24 px-8 pb-4">
              <InputField
                type="date"
                label="Invoice Date"
                labelclassName="text-lg"
                name="inv_date"
                register={register}
                onChange={(event) => onChangeDatePicker("inv_date", event)}
                defaultValue={defaultDate.toISOString().slice(0, 10)}
                errors={errors}
                isRequired
              />
              <InputField
                type="text"
                name="inv_number"
                register={register}
                onChange={(event) =>
                  handleSetInvoiceNumber("inv_number", event)
                }
                label="Invoice Number"
                labelclassName="text-lg"
                isRequired
                errors={errors}
              />
            </div>
            <div className="grid grid-cols-2 gap-24 px-8 pb-4">
              <InputField
                isRequired
                type="date"
                name="due_date"
                onChange={(event) => onChangeDatePicker("due_date", event)}
                defaultValue={defaultDate.toISOString().slice(0, 10)}
                label="Due Date"
                labelclassName="text-lg"
                errors={errors}
                register={register}
              />
              <Space direction="vertical">
                <label htmlFor="company_id" className="text-lg">
                  Name Insurer <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  {...register("company_id")}
                  name="company_id"
                  defaultValue={"disabled"}
                  onChange={(e) => {
                    if (companyDatas) {
                      const company = companyDatas.data.find(
                        (item) => item.id == parseInt(e.target.value),
                      );
                      if (company) {
                        setValue("insurer_address", company.address);
                      }
                    }
                  }}
                  className="w-full border border-gray-300 hover:border-blue-400 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="disabled" disabled>
                    Open to select
                  </option>
                  {companyDatas?.data.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {errors["company_id"]?.message && (
                  <p className="text-red-500 text-[14px]">
                    Please select one of insurer name!
                  </p>
                )}
              </Space>
            </div>
            <div className="grid grid-cols-2 gap-24 px-8 pb-4">
              <Space direction="vertical">
                <label htmlFor="case_id" className="text-lg">
                  Case Number <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  defaultValue={defaultValues?.case_id}
                  {...register("case_id", { onChange: handleCaseNumber })}
                  id="case_id"
                  className="w-full border border-gray-300 hover:border-blue-400 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option value="disabled" disabled selected>
                    Open to select
                  </option>
                  {(submitCases?.data ?? []).map((data) => (
                    <option key={data.id} value={data.id}>
                      {formatNumberPrefixZero(parseInt(data.id))}
                    </option>
                  ))}
                </select>
                <p className="text-[14px] text-red-500">
                  {errors && errors["case_id"]?.message}
                </p>
              </Space>
              <div>
                <label htmlFor="client_reference" className="text-lg">
                  Client Reference
                </label>
                <div className="flex gap-5">
                  <InputField
                    name="client_reference"
                    register={register}
                    placeholder="Enter client name"
                    className="w-full"
                    errors={errors}
                  />
                  <InputField
                    isRequired
                    type="date"
                    name="ref_date"
                    onChange={(event) => onChangeDatePicker("ref_date", event)}
                    defaultValue={defaultDate.toISOString().slice(0, 10)}
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-24 px-8 pb-8">
              <Space direction="vertical">
                <label htmlFor="insurer_address" className="text-lg">
                  Insurer Address <span className="text-red-500">*</span>
                </label>
                <TextArea
                  rows={7}
                  required
                  {...register("insurer_address")}
                  placeholder="Enter information"
                  value={getValues().insurer_address}
                  onChange={(e) => {
                    setValue("insurer_address", e.target.value);
                  }}
                />
                {errors && (
                  <p className="text-[14px] text-red-500">
                    {errors["insurer_address"]?.message}
                  </p>
                )}
              </Space>
              <Space direction="vertical">
                <label htmlFor="add_information" className="text-lg">
                  Additional Information
                </label>
                <TextArea
                  rows={7}
                  placeholder="Enter additional information"
                  defaultValue={paymentData?.add_information}
                  onChange={(e) => {
                    setValue("add_information", e.target.value);
                  }}
                />
              </Space>
            </div>
          </div>
        </div>
        <div className="w-full mt-4 mb-8 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
          <Space className="flex justify-between items-center px-8 pt-7">
            <h1 className="text-2xl font-medium">Loss Adjuster's Fee</h1>
          </Space>
          <Divider className="mb-0 pt-5 pb-4" />
          <div className="px-8 pb-10">
            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col gap-9">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="currency" className="text-xl">
                    Type Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("currency")}
                    required
                    defaultValue={getValues().currency}
                    className="w-full border border-gray-300 hover:border-blue-400 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-1 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">Open to select</option>
                    <option value="usd">USD (United States Dolar)</option>
                    <option value="idr">IDR (Indonesia Rupiah)</option>
                  </select>
                </div>
                <InputNumberField
                  readOnly
                  fullwidth
                  isRequired
                  name="claim_adjustment"
                  label="Claim Adjustment Amount"
                  labelclassName="text-xl"
                  control={control}
                  setValue={setValue}
                  errors={errors}
                />
                <InputNumberField
                  readOnly
                  fullwidth
                  isRequired
                  name="claim_adjustment_fee"
                  control={control}
                  setValue={setValue}
                  label="Adjuster Fee"
                  labelclassName="text-xl"
                  errors={errors}
                />
              </div>
              <div className="flex flex-col gap-7">
                <Tooltip title="Total Adjuster Fee">
                  <div>
                    <InputNumberField
                      readOnly
                      fullwidth
                      isRequired
                      name="portion_100_percent"
                      control={control}
                      setValue={setValue}
                      label="100% Portion"
                      labelclassName="text-xl"
                      errors={errors}
                    />
                  </div>
                </Tooltip>
                <Space direction="vertical">
                  <label htmlFor="adjuster_share" className="text-xl">
                    Your Share <span className="text-red-500">*</span>
                  </label>
                  <Row gutter={36}>
                    <Col span={16}>
                      <Slider
                        min={0}
                        step={5}
                        max={100}
                        tooltip={{ formatter }}
                        onChange={onChangeNumber}
                        value={adjusterShare.number}
                      />
                    </Col>
                    <Col span={8}>
                      <InputField
                        required
                        name="your_share"
                        register={register}
                        className="w-full"
                        onChange={handleChangeShare}
                        value={adjusterShare.percentage}
                      />
                    </Col>
                  </Row>
                </Space>
                <Tooltip title="{Your Share}% * 100% Portion">
                  <div>
                    <InputNumberField
                      readOnly
                      fullwidth
                      isRequired
                      name="amount_due"
                      control={control}
                      setValue={setValue}
                      label="Amount Due"
                      labelclassName="text-xl"
                      errors={errors}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mt-4 mb-8 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
          <Space className="flex justify-between items-center px-8 pt-7">
            <h1 className="text-2xl font-medium">Expenses</h1>
          </Space>
          <Divider className="mb-0 pt-5 pb-4" />
          <div className="px-8 pb-10">
            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col gap-9">
                <div className="mb-3 flex flex-col space-y-1">
                  <label htmlFor="currency" className="text-xl">
                    Type Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    {...register("currency")}
                    defaultValue={getValues().currency}
                    className="w-full border border-gray-300 hover:border-blue-400 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-1 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">Open to select</option>
                    <option value="usd">USD (United States Dolar)</option>
                    <option value="idr">IDR (Indonesia Rupiah)</option>
                  </select>
                </div>
                <Tooltip title="Total Expenses">
                  <div>
                    <InputNumberField
                      readOnly
                      fullwidth
                      isRequired
                      name="expenses_portion"
                      control={control}
                      setValue={setValue}
                      label="100% Portion"
                      labelclassName="text-xl"
                    />
                  </div>
                </Tooltip>
              </div>
              <div className="flex flex-col gap-9">
                <InputField
                  readOnly
                  disabled
                  isRequired
                  name="adjuster_share"
                  value={adjusterShare.percentage}
                  label="Your Share"
                  labelclassName="text-xl"
                />
                <Tooltip title="{Your Share}% * 100% Portion">
                  <div>
                    <InputNumberField
                      readOnly
                      fullwidth
                      isRequired
                      name="expenses"
                      control={control}
                      setValue={setValue}
                      label="Amount Due"
                      labelclassName="text-xl"
                      errors={errors}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="px-8 pb-10">
            <TableExpenses
              selectedCurrency={getValues().currency ?? "idr"}
              expensesDatas={expensesDatas?.data}
            />
          </div>
        </div>
        <div className="w-full mt-4 mb-8 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
          <Space className="flex justify-between items-center px-8 pt-7">
            <h1 className="text-2xl font-medium">Payment Summary</h1>
          </Space>
          <Divider className="mb-0 pt-5 pb-4" />
          <div className="px-8 pb-10">
            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col gap-9">
                <Space direction="vertical">
                  <label htmlFor="currency" className="text-xl">
                    Type Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    {...register("currency")}
                    defaultValue={getValues().currency}
                    className="w-full border border-gray-300 hover:border-blue-400 text-gray-900 text-xl rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">Open to select</option>
                    <option value="usd">USD (United States Dolar)</option>
                    <option value="idr">IDR (Indonesia Rupiah)</option>
                  </select>
                </Space>
                <Tooltip title="Amount due adjuster - Amount due expenses">
                  <div>
                    <InputNumberField
                      readOnly
                      fullwidth
                      isRequired
                      name="subtotal"
                      control={control}
                      setValue={setValue}
                      label="Sub Total"
                      labelclassName="text-xl"
                      errors={errors}
                    />
                  </div>
                </Tooltip>

                <InputNumberField
                  fullwidth
                  isRequired
                  name="stamp_duty"
                  label="Stamp Duty"
                  onChange={(value) => {
                    const stamp = parseInt(`${value}`);
                    setStamp(stamp);
                  }}
                  control={control}
                  setValue={setValue}
                  defaultValue={10000}
                  labelclassName="text-xl"
                  errors={errors}
                />
              </div>
              <div className="flex flex-col gap-10">
                <Row gutter={16}>
                  <label htmlFor="tax_base" className="text-xl pb-2.5">
                    Tax Base
                  </label>
                  <Col span={8}>
                    <Input
                      size="large"
                      required
                      value={tax}
                      onChange={(e) => {
                        let value = parseInt(e.target.value);
                        value = Number.isNaN(value) ? 0 : value;
                        value = value > 100 ? 100 : value;
                        setTax(value);
                        setValue("tax_percentage", value);
                      }}
                      type="number"
                      suffix={<BsPercent size={20} color="grey" />}
                      name="tax_percentage"
                      defaultValue={11}
                    />
                  </Col>
                  <Col span={16}>
                    <Tooltip
                      title={`Amount due adjuster - (${tax}% * Amount due adjuster)`}>
                      <div>
                        <InputNumberField
                          readOnly
                          fullwidth
                          label=""
                          name="tax_base"
                          control={control}
                          setValue={setValue}
                          labelclassName="text-xl"
                          isRequired
                          errors={errors}
                        />
                      </div>
                    </Tooltip>
                  </Col>
                  <Col span={24} className="mt-2">
                    <label htmlFor="ppn" className="text-xl pb-2.5">
                      PPN
                    </label>
                    <Input
                      size="large"
                      required
                      value={ppn}
                      onChange={(e) => {
                        let value = parseInt(e.target.value);
                        value = Number.isNaN(value) ? 0 : value;
                        setPpn(value);
                      }}
                      type="number"
                      name="ppn"
                      defaultValue={0}
                    />
                  </Col>
                </Row>

                <Tooltip title="2% * Tax Base">
                  <div>
                    <InputNumberField
                      readOnly
                      fullwidth
                      isRequired
                      prefix="-"
                      name="wht"
                      control={control}
                      setValue={setValue}
                      errors={errors}
                      label="WHT (Pph Pasal 23 = 2%)"
                      onChange={(value) => {
                        const wht = parseInt(`${value}`);
                        setWHT(wht);
                      }}
                      labelclassName="text-lg"
                    />
                  </div>
                </Tooltip>
                <Tooltip title="Subtotal + Stamp Duty - WHT">
                  <div>
                    <InputNumberField
                      readOnly
                      isRequired
                      fullwidth
                      name="total_amount_due"
                      control={control}
                      setValue={setValue}
                      label="Total Amount Due"
                      labelclassName="text-xl"
                      errors={errors}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        {!isView && (
          <div className="mt-10 mb-5 flex gap-5 justify-end">
            <button
              type="button"
              onClick={handleCancelModal}
              className="text-white bg-primary-200 hover:bg-primary-300 focus:outline-none focus:ring-4 focus:ring-primary-400 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-2 mb-2 dark:bg-primary-400 dark:hover:bg-primary-500 dark:focus:ring-primary-800">
              Cancel
            </button>
            <button
              type="button"
              onClick={paymentData ? handleUpdateModal : handleSaveModal}
              className="text-white bg-primary-500 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-400 font-medium rounded-lg text-xl px-5 py-2.5 text-center mr-2 mb-2 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              {paymentData ? "Update" : "Save"}
            </button>
            <Modal open={isOpen} onCancel={() => onClose()} footer={null}>
              <div>
                <h1 className="text-lg font-semibold" style={{ marginBottom: 0 }}>
                  Save
                </h1>
                <Divider />
              </div>
              {modalAction === "save_data" ? (
                <p className="text-xl text-center">
                  Are you sure want to save changes?
                </p>
              ) : modalAction === "edit_data" ? (
                <p className="text-xl text-center">
                  Are you sure want to update data?
                </p>
              ) : (
                <p className="text-xl text-center">
                  Are you sure want to discard changes?
                </p>
              )}
              <div className="flex justify-center gap-9 mt-10">
                {modalAction === "save_data" ? (
                  <Button
                    onClick={handleSubmit(handleAddPayment)}
                    style={{ padding: "1rem 2.5rem" }}
                    className="flex items-center bg-primary-400 text-sm text-white">
                    Save
                  </Button>
                ) : modalAction === "edit_data" ? (
                  <Button
                    onClick={handleSubmit(handleAddPayment)}
                    style={{ padding: "1rem 2.5rem" }}
                    className="flex items-center bg-primary-400 text-sm text-white">
                    Update
                  </Button>
                ) : (
                  <Button
                    onClick={handleCloseForm}
                    style={{ padding: "1rem 2.5rem" }}
                    className="flex items-center bg-primary-400 text-sm text-white">
                    Yes
                  </Button>
                )}
                <Button
                  type="ghost"
                  style={{ padding: "1rem 2.5rem" }}
                  onClick={() => onClose()}
                  className="flex items-center border-primary-400 text-sm text-primary">
                  No
                </Button>
              </div>
            </Modal>
          </div>
        )}
      </form>
    </>
  );
};

export default FormPayment;
