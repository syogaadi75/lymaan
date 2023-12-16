import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputField } from "components/hookform";
import { useForm } from "react-hook-form";
import { SlArrowRight } from "react-icons/sl";
import { ImportButtons, TableModalImport } from "./TableModalImport";
import cx from "classnames";
import { useDisclosure } from "hooks";
import { ColumnsType } from "antd/es/table";
import {
  ApiListRequest,
  CompanyResponse,
  InsurerData,
  MemberType,
  defaultApiListOptions,
} from "interfaces";
import { useGetListCompany } from "hooks/query";
import { useEffect, useState } from "react";
import Button from "components/ui/buttons/Button";
import { FaPlus } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import moment from "moment";
import { useAtom } from "jotai";
import { notificationAtom } from "hooks/atom/useAtom";

interface DataSourceTable extends InsurerData {
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
    title: "Leader Name",
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
  companyName: string;
  companyAddress: string;
  // companyContact: string;
  // companyPersonInCharge: string;
  companyEmailAddress: string;
  leaderShare: number;
  // companyPhoneNumber: number;
  // companyWebsite: string;
}> = yup.object({
  companyName: yup.string().required("Leader Name is a required field!"),
  companyAddress: yup.string().required("Leader Address is a required field!"),
  // companyContact: yup.string().required("Company Contact is a required field!"),
  // companyPersonInCharge: yup
  //   .string()
  //   .required("Company Person In Charge is a required field!"),
  companyEmailAddress: yup
    .string()
    .email()
    .required("Leader Email Address is a required field!"),
  // companyPhoneNumber: yup
  //   .number()
  //   .typeError("Company Phone Number must be a number!.")
  //   .required("Company Phone Number is a required field!"),
  // companyWebsite: yup
  //   .string()
  //   .url()
  //   .required("Company Website is a required field!"),
  leaderShare: yup
    .number()
    .required("Leader Share is a required field!"),
});

const formSchemaMember: yup.SchemaOf<{
  memberName: string;
  memberAddress: string;
  memberEmailAddress: string;
  memberShare: number;
}> = yup.object({
  memberName: yup.string().required("Member Name is a required field!"),
  memberAddress: yup.string().required("Member Address is a required field!"),
  memberEmailAddress: yup
    .string()
    .email()
    .required("Member Email Address is a required field!"),
  memberShare: yup
    .number()
    .required("Member Share is a required field!"),
});


const GeneralDatabaseTab = ({
  company,
  isOpenTab,
  setCompany,
  members,
  setMembers,
  setIndex,
  index,
  companyComplete,
  setCompanyComplete,
}: {
  company?: InsurerData;
  isOpenTab: boolean;
  companyComplete: number;
  members: MemberType[];
  index: number;
  setCompanyComplete: (values: number) => void;
  setCompany: (values: InsurerData) => void;
  setMembers: (values: MemberType[]) => void;
  setIndex: (value: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ resolver: yupResolver(formSchema) });

  const {
    register: registerMember,
    handleSubmit: handleSubmitMember,
    formState: { errors: errorsMember },
    reset: resetMember,
    watch: watchMember,
  } = useForm({ resolver: yupResolver(formSchemaMember) });

  const [notificationMsg, setNotificationMsg] = useAtom(notificationAtom);

  const leaderShareValue = watch('leaderShare');
  const memberShareValue = watchMember('memberShare');
  const [globalCompany, setGlobalCompany] = useState({})
  const [isNol, setIsNol] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenMember, onOpen: onOpenMember, onClose: onCloseMember } = useDisclosure();

  const [listOption, setListOption] = useState<ApiListRequest>(
    defaultApiListOptions,
  );

  const { data, isLoading } = useGetListCompany(listOption);

  const changeShare = () => {
    let newGlobalCompany = { ...globalCompany, share: leaderShareValue };
    setGlobalCompany(newGlobalCompany);
    setCompany(newGlobalCompany);
  };

  const changeMemberShare = () => {
    const updatedMembers = members.map((member, _index) =>
      _index === index ? { ...member, share: memberShareValue } : member
    );
    setMembers(updatedMembers);
  };

  const addMember = () => {
    const member: MemberType = {
      id: 0,
      name: '',
      address: '',
      email: '',
      share: 0,
    };
    setMembers([...members, member]);
    setIndex([...members, member].length - 1);

    resetMember();
  };

  const deleteMember = () => {
    setMembers(members.filter((_item, _index) => _index != index));
    if (index > 0) {
      if (members?.length - 1 == index) {
        setIndex(index - 1);
      } else {
        setIndex(index);
      }
    } else {
      setIndex(0);
    }
  };

  const onImportMember = (member: InsurerData) => {
    member.share = 0;
    setMembers(
      members?.map((_member, _index) =>
        _index == index ? member : _member,
      ),
    );

    resetMember({
      memberName: member.name,
      memberAddress: member.address,
      memberEmailAddress: member.email,
    });
    onCloseMember();
  };

  useEffect(() => {
    if (members?.length > 0 && isOpenTab) {
      resetMember({
        memberName: members[index].name,
        memberAddress: members[index].address,
        memberEmailAddress: members[index].email,
        memberShare: members[index].share,
      });
    } else if (members?.length == 0) {
      addMember();
    }
  }, [index, isOpenTab]);

  // TODO : Add action for submit form
  const onSubmit = () => {
    alert("All input valid :>.");
  };

  const onImportData = (company: InsurerData) => {
    let newComp = { ...company, share: leaderShareValue || 0 }

    setGlobalCompany(newComp);
    setCompany(newComp);
    reset({
      companyName: company.name,
      companyAddress: company.address,
      // companyContact: company.contact,
      // companyPersonInCharge: company.person_incharge,
      companyEmailAddress: company.email,
      leaderShare: company.share,
      // companyPhoneNumber: company.phone,
      // companyWebsite: company.website,
    });
    onClose();
  };

  const dataFrom = (data: InsurerData[]): DataSourceTable[] => {
    return (
      data?.map((_data, index) => ({
        ..._data,
        key: _data.id,
        no: index,
        action: <ImportButtons onClick={() => onImportData(_data)} />,
      })) ?? []
    );
  };

  const dataFromMember = (data: InsurerData[]): DataSourceTable[] => {
    return (
      data?.map((_data, index) => ({
        ..._data,
        key: _data.id,
        no: index,
        action: <ImportButtons onClick={() => onImportMember(_data)} />,
      })) ?? []
    );
  };

  const dataSource: DataSourceTable[] = dataFrom(data?.data ?? []);
  const dataSourceMember: DataSourceTable[] = dataFromMember(data?.data ?? []);

  useEffect(() => {
    if (company) onImportData(company);
  }, [company]);

  useEffect(() => {
    let complete = parseInt(leaderShareValue) || 0;
    let tanpaMember = true;
    if (complete === 100) {
      setIsNol(false);
      setCompanyComplete(1);
    } else if (complete > 100) {
      setNotificationMsg({
        notificationType: "error",
        notificationTitle: "Error Input!",
        notificationDescription: "Leader Share tidak boleh lebih dari 100%",
      });

      let newGlobalCompany = { ...globalCompany, share: 0 };
      setGlobalCompany(newGlobalCompany);
      setCompany(newGlobalCompany);
      reset({
        leaderShare: 0
      })
      setCompanyComplete(0);
    } else {
      setIsNol(true);
      tanpaMember = false;
      members.forEach(member => {
        if (member.share) {
          complete += parseInt(member.share) || 0
        }
      })

      if (complete === 100) {
        setCompanyComplete(1);
      } else if (complete > 100) {
        setCompanyComplete(0);
        setNotificationMsg({
          notificationType: "error",
          notificationTitle: "Error Input!",
          notificationDescription: "Leader Share + Member Share tidak boleh lebih dari 100%",
        });
        const updatedMembers = members.map((member, _index) =>
          _index === index ? { ...member, share: 0 } : member
        );
        setMembers(updatedMembers);
        resetMember({
          memberShare: 0
        })
      } else {
        setCompanyComplete(0);
      }
    }
  }, [leaderShareValue, memberShareValue, members]);

  return (
    <div className={cx({ hidden: !isOpenTab })}>
      <form
        className="pl-7 pr-36 mt-5 flex flex-col"
        onSubmit={handleSubmit(onSubmit)}>
        <div
          className={cx(
            "flex gap-5",
            { "items-center": errors.companyName },
            { "items-end": !errors.companyName },
          )}>
          <div className="flex-1">
            <InputField
              name="companyName"
              label="Leader Name"
              labelclassName="font-medium"
              placeholder="Enter name"
              errors={errors}
              disabled
              isRequired={true}
              register={register}
            />
          </div>
          <Button
            size="large"
            className={cx("mb-4 gap-2", { "mt-2": errors.companyName })}
            onClick={() => onOpen()}>
            Import from Database <SlArrowRight size={14} color="white" />
          </Button>
        </div>
        <InputField
          name="companyAddress"
          label="Leader Address"
          labelclassName="font-medium"
          placeholder="Enter address"
          errors={errors}
          disabled
          isRequired={true}
          register={register}
        />
        {/* <InputField
          name="companyContact"
          label="Company Contact"
          labelclassName="font-medium"
          placeholder="Enter contact"
          errors={errors}
          disabled
          isRequired={true}
          register={register}
        /> */}
        {/* <InputField
          name="companyPersonInCharge"
          label="Company Person In Charge"
          labelclassName="font-medium"
          placeholder="Enter person in charge"
          errors={errors}
          disabled
          isRequired={true}
          register={register}
        /> */}
        <InputField
          type="email"
          name="companyEmailAddress"
          label="Leader Email Address"
          labelclassName="font-medium"
          placeholder="Enter email address"
          errors={errors}
          disabled
          isRequired={true}
          register={register}
        />
        {/* <InputField
          type="tel"
          name="companyPhoneNumber"
          label="Company Phone Number"
          labelclassName="font-medium"
          placeholder="Enter phone number"
          errors={errors}
          disabled
          isRequired={true}
          register={register}
        /> */}
        {/* <InputField
          type="url"
          name="companyWebsite"
          label="Company Website"
          labelclassName="font-medium"
          placeholder="Enter website"
          errors={errors}
          disabled
          isRequired={true}
          register={register}
        /> */}

        <InputField
          type="number"
          name="leaderShare"
          label="Leader Share (1-100%)"
          labelclassName="font-medium"
          placeholder="Enter Leader Share"
          errors={errors}
          isRequired={true}
          register={register}
          onKeyUp={changeShare}
        />
      </form>

      {
        (isNol && leaderShareValue > 0) ? (
          <div>
            <div className="flex pl-7 pr-36 mt-5 gap-3 justify-end">
              {
                companyComplete === 1 ? '' : (
                  <>
                    <Button icon={<FaPlus size={16} />} onClick={addMember} size="large">
                      Add Member
                    </Button>
                    <Button
                      icon={<AiOutlineDelete />}
                      size="large"
                      color="danger"
                      disabled={members?.length == 1}
                      onClick={deleteMember}>
                      Delete
                    </Button>
                  </>
                )
              }
            </div>
            <form
              className="pl-7 pr-36 mt-5 flex flex-col"
              onSubmit={handleSubmit(onSubmit)}>
              <div
                className={cx(
                  "flex gap-5",
                  { "items-center": errorsMember.memberName },
                  { "items-end": !errorsMember.memberName },
                )}>
                <Button
                  size="large"
                  className={cx("mb-4 gap-2", { "mt-2": errorsMember.memberName })}
                  onClick={() => onOpenMember()}>
                  Import from Database <SlArrowRight size={14} color="white" />
                </Button>
              </div>
              <InputField
                name="memberName"
                label="Member Name"
                labelclassName="font-medium"
                placeholder="Enter Name"
                errors={errorsMember}
                isRequired={true}
                register={registerMember}
                disabled
              />
              <InputField
                name="memberAddress"
                label="Member Address"
                labelclassName="font-medium"
                placeholder="Enter address"
                errors={errorsMember}
                isRequired={true}
                register={registerMember}
                disabled
              />
              <InputField
                type="email"
                name="memberEmailAddress"
                label="Member Email Address"
                labelclassName="font-medium"
                placeholder="Enter email address"
                errors={errorsMember}
                isRequired={true}
                register={registerMember}
                disabled
              />
              <InputField
                type="number"
                name="memberShare"
                label="Member Share (1-100%)"
                labelclassName="font-medium"
                placeholder="Enter Member Share"
                errors={errorsMember}
                isRequired={true}
                register={registerMember}
                onKeyUp={changeMemberShare}
              />
            </form>

            <TableModalImport
              title="Import Company Database"
              onClose={onCloseMember}
              isOpen={isOpenMember}
              {...{ columns, dataSource: dataSourceMember, isLoading }}
              onChangeSearch={(value: string) =>
                setListOption({
                  page: 1,
                  search: value,
                  per_page: listOption.per_page,
                })
              }
            />
          </div>
        ) : ''
      }
      <TableModalImport
        title="Import Company Database"
        onClose={onClose}
        isOpen={isOpen}
        {...{ columns, dataSource, isLoading }}
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

export default GeneralDatabaseTab;
