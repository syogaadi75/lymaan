import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {InputField} from "components/hookform";
import {useForm} from "react-hook-form";
import {SlArrowRight} from "react-icons/sl";
import {FaPlus} from "react-icons/fa";
import {ImportButtons, TableModalImport} from "./TableModalImport";
import cx from "classnames";
import {useDisclosure} from "hooks";
import {AdjusterType, ApiListRequest, defaultApiListOptions} from "interfaces";
import {ColumnsType} from "antd/es/table";
import {useGetListAdjuster} from "hooks/query";
import {useEffect, useState} from "react";
import {AiOutlineDelete} from "react-icons/ai";
import Button from "components/ui/buttons/Button";
import moment from "moment";

interface DataSourceTable extends AdjusterType {
  key: React.Key;
  no: number;
  action: React.ReactElement;
}

const columns: ColumnsType<DataSourceTable> = [
  {
    title: "No",
    dataIndex: "no",
    render: (_, _record, index) => index + 1,
  },
  {
    title: "Adjuster Name",
    dataIndex: "name",
    sorter: {
      compare: (a, b) => a.name.localeCompare(b.name),
    },
  },
  {
    title: "Created Date",
    dataIndex: "created_at",
    sorter: {
      compare: (a, b) =>
        new Date(a.created_at)
          .toString()
          .localeCompare(new Date(b.created_at).toString()),
    },
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const formSchema: yup.SchemaOf<{
  adjusterName: string;
  adjusterAddress: string;
  adjusterEmailAddress: string;
  adjusterPhoneNumber: number;
  adjusterDateJoined: Date;
}> = yup.object({
  adjusterName: yup.string().required("Adjuster Name is a required field!"),
  adjusterAddress: yup.string().required("Adjuster Name is a required field!"),
  adjusterEmailAddress: yup
    .string()
    .email()
    .required("Adjuster Name is a required field!"),
  adjusterPhoneNumber: yup
    .number()
    .required("Adjuster Name is a required field!"),
  adjusterDateJoined: yup
    .date()
    .typeError("Adjuster Name must be a date!")
    .required("Adjuster Name is a required field!"),
});

const AdjusterTeamDatabaseTab = ({
  isOpenTab,
  adjusters,
  setAdjusters,
  index,
  setIndex,
}: {
  isOpenTab: boolean;
  adjusters: AdjusterType[];
  setAdjusters: (values: AdjusterType[]) => void;
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

  const {data, isLoading} = useGetListAdjuster(listOption);

  const addAdjuster = () => {
    const adjuster: AdjusterType = {
      id: 0,
      name: "",
      address: "",
      email: "",
      phone: "",
      roles: "Adjuster",
      created_at: new Date(),
    };
    setAdjusters([...adjusters, adjuster]);
    setIndex([...adjusters, adjuster].length - 1);

    reset();
  };

  const deleteAdjuster = () => {
    setAdjusters(adjusters.filter((_item, _index) => _index != index));
    if (index > 0) {
      if (adjusters.length - 1 == index) {
        setIndex(index - 1);
      } else {
        setIndex(index);
      }
    } else {
      setIndex(0);
    }
  };

  useEffect(() => {
    if (adjusters.length > 0 && isOpenTab) {
      reset({
        adjusterName: adjusters[index].name,
        adjusterAddress: adjusters[index].address,
        adjusterEmailAddress: adjusters[index].email,
        adjusterPhoneNumber: adjusters[index].phone,
        adjusterDateJoined: moment(adjusters[index].created_at).format(
          "YYYY-MM-DD",
        ),
      });
    } else if (adjusters.length == 0) {
      addAdjuster();
    }
  }, [index, isOpenTab]);

  // TODO : Add action for submit form
  const onSubmit = () => {
    alert("All input valid :>.");
  };

  const onImportData = (adjuster: AdjusterType) => {
    setAdjusters(
      adjusters.map((_adjuster, _index) =>
        _index == index ? adjuster : _adjuster,
      ),
    );

    reset({
      adjusterName: adjuster.name,
      adjusterAddress: adjuster.address,
      adjusterEmailAddress: adjuster.email,
      adjusterPhoneNumber: adjuster.phone,
      adjusterDateJoined: moment(adjuster.created_at).format("YYYY-MM-DD"),
    });
    onClose();
  };

  const dataFrom = (data: AdjusterType[]): DataSourceTable[] => {
    return (
      data
        ?.filter((_data) => _data.roles)
        .map((_data, index) => ({
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
      <div className="flex pl-7 pr-36 mt-5 gap-3 justify-end">
        <Button icon={<FaPlus size={16} />} onClick={addAdjuster} size="large">
          Add Adjuster
        </Button>
        <Button
          icon={<AiOutlineDelete />}
          size="large"
          color="danger"
          disabled={adjusters.length == 1}
          onClick={deleteAdjuster}>
          Delete
        </Button>
      </div>
      <form
        className="pl-7 pr-36 mt-5 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}>
        <div
          className={cx(
            "flex gap-5",
            {"items-center": errors.adjusterName},
            {"items-end": !errors.adjusterName},
          )}>
          <div className="flex-1">
            <InputField
              name="adjusterName"
              label="Adjuster Full Name"
              labelclassName="font-medium"
              placeholder="Enter full name"
              errors={errors}
              isRequired={true}
              register={register}
            />
          </div>
          <Button
            size="large"
            className={cx("mb-4 gap-2", {"mt-2": errors.adjusterName})}
            onClick={() => onOpen()}>
            Import from Database <SlArrowRight size={14} color="white" />
          </Button>
        </div>
        <InputField
          name="adjusterAddress"
          label="Adjuster Address"
          labelclassName="font-medium"
          placeholder="Enter address"
          errors={errors}
          isRequired={true}
          register={register}
        />
        <InputField
          type="email"
          name="adjusterEmailAddress"
          label="Adjuster Email Address"
          labelclassName="font-medium"
          placeholder="Enter email address"
          errors={errors}
          isRequired={true}
          register={register}
        />
        <InputField
          type="tel"
          name="adjusterPhoneNumber"
          label="Adjuster Phone Number"
          labelclassName="font-medium"
          placeholder="Enter phone number"
          errors={errors}
          isRequired={true}
          register={register}
        />
        <InputField
          type="date"
          name="adjusterDateJoined"
          label="Adjuster Date Joined"
          labelclassName="font-medium"
          errors={errors}
          isRequired={true}
          register={register}
        />
      </form>

      <TableModalImport
        title="Import Adjuster Database"
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
      />
    </div>
  );
};

export default AdjusterTeamDatabaseTab;
