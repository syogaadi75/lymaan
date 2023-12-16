import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {InputField} from "components/hookform";
import {useForm} from "react-hook-form";
import {SlArrowRight} from "react-icons/sl";
import {ImportButtons, TableModalImport} from "./TableModalImport";
import cx from "classnames";
import {useDisclosure} from "hooks";
import {ApiListRequest, VendorType, defaultApiListOptions} from "interfaces";
import {ColumnsType} from "antd/es/table";
import {useGetListVendor} from "hooks/query";
import {useEffect, useState} from "react";
import {formatDate} from "utils";
import Button from "components/ui/buttons/Button";

interface DataSourceTable extends VendorType {
  key: React.Key;
  no: number;
  action: React.ReactElement;
}

const columns: ColumnsType<DataSourceTable> = [
  {
    title: "No",
    dataIndex: "no",
    render: (_, record, index) => index + 1,
  },
  {
    title: "Insured Name",
    dataIndex: "name",
    sorter: {
      compare: (a, b) => a.name.localeCompare(b.name),
    },
  },
  {
    title: "Created Date",
    dataIndex: "created_at",
    sorter: {
      compare: (a, b) => a.created_at.localeCompare(b.created_at),
    },
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const formSchema: yup.SchemaOf<{
  vendorName: string;
  vendorAddress: string;
  vendorContact: string;
  vendorPersoninCharge: number;
  vendorEmailAddress: string;
  vendorWebsite: string;
}> = yup.object({
  vendorName: yup.string().required("Travel Name is a required field!"),
  vendorAddress: yup.string().required("Travel Name is a required field!"),
  vendorContact: yup.string().required("Travel Name is a required field!"),
  vendorPersoninCharge: yup
    .number()
    .required("Travel Name is a required field!"),
  vendorEmailAddress: yup.string().required("Travel Name is a required field!"),
  vendorWebsite: yup.string().required("Travel Name is a required field!"),
});

const InsuredNameTab = ({
  insured,
  isOpenTab,
  setVendor,
}: {
  insured?: VendorType;
  isOpenTab: boolean;
  setVendor: (values: VendorType) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({resolver: yupResolver(formSchema)});
  const {isOpen, onClose, onOpen} = useDisclosure();

  const [listOption, setListOption] = useState<ApiListRequest>(
    defaultApiListOptions,
  );

  const {data, isLoading} = useGetListVendor(listOption);

  const onSubmit = () => {
    alert("All input valid :>.");
  };

  const onImportData = (vendor: VendorType) => {
    setVendor(vendor);
    reset({
      vendorName: vendor.name,
      vendorAddress: vendor.address,
      vendorContact: vendor.phone,
      vendorPersoninCharge: vendor.pic,
      vendorEmailAddress: vendor.email,
      vendorWebsite: vendor.website,
    });
    onClose();
  };

  const dataFrom = (data: VendorType[]): DataSourceTable[] => {
    return (
      data?.map((_data, index) => ({
        ..._data,
        key: _data.id,
        no: index,
        created_at: formatDate(new Date(_data.created_at)),
        action: <ImportButtons onClick={() => onImportData(_data)} />,
      })) ?? []
    );
  };

  const dataSource: DataSourceTable[] = dataFrom(data?.data ?? []);

  useEffect(() => {
    if (insured) onImportData(insured);
  }, [insured]);

  return (
    <div className={cx({hidden: !isOpenTab})}>
      <form
        className="pl-7 pr-36 mt-5 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}>
        <div
          className={cx(
            "flex gap-5",
            {"items-center": errors.vendorName},
            {"items-end": !errors.vendorName},
          )}>
          <div className="flex-1">
            <InputField
              name="vendorName"
              label="Insured Name"
              labelclassName="font-medium"
              placeholder="Enter name"
              errors={errors}
              isRequired={true}
              register={register}
            />
          </div>
          <Button
            size="large"
            className={cx("mb-4 gap-2", {"mt-2": errors.vendorName})}
            onClick={() => onOpen()}>
            Import from Database <SlArrowRight size={14} color="white" />
          </Button>
        </div>
        <InputField
          name="vendorAddress"
          label="Insured Address"
          labelclassName="font-medium"
          placeholder="Enter address"
          errors={errors}
          isRequired={true}
          register={register}
        />
        <InputField
          name="vendorContact"
          label="Insured Contact"
          labelclassName="font-medium"
          placeholder="Enter contact"
          errors={errors}
          isRequired={true}
          register={register}
        />
        <InputField
          type="tel"
          name="vendorPersoninCharge"
          label="Travel Person In Charge"
          labelclassName="font-medium"
          placeholder="Enter person in charge"
          errors={errors}
          isRequired={true}
          register={register}
        />
        <InputField
          name="vendorEmailAddress"
          label="Travel Email Address"
          labelclassName="font-medium"
          placeholder="Enter email address"
          errors={errors}
          isRequired={true}
          register={register}
        />
        <InputField
          name="vendorWebsite"
          label="Insured Insurer Website"
          labelclassName="font-medium"
          placeholder="Enter url website"
          errors={errors}
          isRequired={true}
          register={register}
        />{" "}
      </form>
      <TableModalImport
        title="Import Insured Database"
        onClose={onClose}
        isOpen={isOpen}
        {...{columns, dataSource, isLoading}}
        onChangeSearch={(value: string) =>
          setListOption({
            page: 1,
            search: value,
            per_page: listOption.per_page,
          })
        }
      />{" "}
    </div>
  );
};

export default InsuredNameTab;
