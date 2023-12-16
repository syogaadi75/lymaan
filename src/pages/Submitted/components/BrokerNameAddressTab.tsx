import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {InputField} from "components/hookform";
import {useForm} from "react-hook-form";
import {SlArrowRight} from "react-icons/sl";
import {ImportButtons, TableModalImport} from "./TableModalImport";
import cx from "classnames";
import {useDisclosure} from "hooks";
import {ApiListRequest, BrokerType, defaultApiListOptions} from "interfaces";
import {ColumnsType} from "antd/es/table";
import {useGetListBroker} from "hooks/query";
import {useEffect, useState} from "react";
import Button from "components/ui/buttons/Button";

interface DataSourceTable extends BrokerType {
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
    title: "Broker Name",
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
  name: string;
  address: string;
  company: string;
  phone: number;
  affiliation: string;
}> = yup.object({
  name: yup.string().required("Broker Name is a required field!"),
  address: yup.string().required("Broker Name is a required field!"),
  company: yup.string().required("Broker Name is a required field!"),
  phone: yup.number().required("Broker Name is a required field!"),
  affiliation: yup.string().required("Broker Name is a required field!"),
});

const nameAddressTab = ({
  isOpenTab,
  brokers,
  setBrokers,
  index,
  setIndex,
}: {
  isOpenTab: boolean;
  brokers: BrokerType[];
  setBrokers: (values: BrokerType[]) => void;
  index: number;
  setIndex: (value: number) => void;
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
  const {data, isLoading} = useGetListBroker(listOption);

  const addBroker = () => {
    const broker: BrokerType = {
      id: 0,
      name: "",
      address: "",
      company: "",
      phone: "",
      affiliation: "",
      created_at: "",
    };
    setBrokers([...brokers, broker]);
    setIndex([...brokers, broker].length - 1);

    reset();
  };

  useEffect(() => {
    if (brokers.length > 0 && isOpenTab) {
      try {
        reset({
          name: brokers[index].name,
          address: brokers[index].address,
          company: brokers[index].company,
          phone: brokers[index].phone,
          affiliation: brokers[index].affiliation,
        });
      } catch (e) {
        setIndex(0);
      }
    } else if (brokers.length == 0) {
      addBroker();
    }
  }, [index, isOpenTab]);

  const onSubmit = () => {
    alert("All input valid :>.");
  };

  const onImportData = (broker: BrokerType) => {
    setBrokers(
      brokers.map((_broker, _index) => (_index == index ? broker : _broker)),
    );

    reset({
      name: broker.name,
      address: broker.address,
      company: broker.company,
      phone: broker.phone,
      affiliation: broker.affiliation,
    });
    onClose();
  };

  const dataFrom = (data: BrokerType[]): DataSourceTable[] => {
    return (
      data?.map((_data, index) => ({
        ..._data,
        key: _data.id,
        no: index,
        action: <ImportButtons onClick={() => onImportData(_data)} />,
      })) ?? []
    );
  };

  const dataSource: DataSourceTable[] = dataFrom(data?.data ?? []);

  return (
    <div className={cx({hidden: !isOpenTab})}>
      <form
        className="pl-7 pr-36 mt-5 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}>
        <div
          className={cx(
            "flex gap-5",
            {"items-center": errors.name},
            {"items-end": !errors.name},
          )}>
          <div className="flex-1">
            <InputField
              name="name"
              label="Broker Full Name"
              labelclassName="font-medium"
              placeholder="Enter full name"
              errors={errors}
              isRequired={true}
              register={register}
            />
          </div>
          <Button
            size="large"
            className={cx("mb-4 gap-2", {"mt-2": errors.name})}
            onClick={() => onOpen()}>
            Import from Database <SlArrowRight size={14} color="white" />
          </Button>
        </div>
        <InputField
          name="address"
          label="Broker Address"
          labelclassName="font-medium"
          placeholder="Enter address"
          errors={errors}
          isRequired={true}
          register={register}
        />
        <InputField
          name="company"
          label="Broker Company"
          labelclassName="font-medium"
          placeholder="Enter Company Name"
          errors={errors}
          isRequired={true}
          register={register}
        />
        <InputField
          type="tel"
          name="phone"
          label="Broker Phone Number"
          labelclassName="font-medium"
          placeholder="Enter phone number"
          errors={errors}
          isRequired={true}
          register={register}
        />
        <InputField
          name="affiliation"
          label="Broker Affiliation / Source"
          labelclassName="font-medium"
          placeholder="Enter Source"
          errors={errors}
          isRequired={true}
          register={register}
        />
      </form>
      <TableModalImport
        title="Import Broker Database"
        onClose={onClose}
        isOpen={isOpen}
        {...{columns, dataSource, isLoading}}
        onChangeSearch={(value: string) => {
          setListOption({
            page: 1,
            search: value,
            per_page: listOption.per_page,
          });
        }}
      />
    </div>
  );
};

export default nameAddressTab;
