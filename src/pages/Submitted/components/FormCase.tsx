import {useEffect, useState} from "react";
import AdjusterTeamDatabaseTab from "./AdjusterTeamDatabaseTab";
import GeneralDatabaseTab from "./GeneralDatabaseTab";
import BrokerNameAddressTab from "./BrokerNameAddressTab";
import InsuredNameTab from "./InsuredNameTab";
import {Divider, Pagination, message} from "antd";
import cx from "classnames";
import {useCreateCase, useCreateReportname, useUpdateCase} from "hooks/query";
import {
  AdjusterType,
  BrokerType,
  CaseResponse,
  CompanyResponse,
  InsurerData,
  MemberType,
  VendorType,
} from "interfaces";
import {useHistory} from "react-router-dom";
import {Breadcrumb} from "components/ui";
import Button from "components/ui/buttons/Button";

type FormCaseProps = {
  submitcase?: CaseResponse;
};

const FormCase = ({submitcase}: FormCaseProps) => {
  const route = useHistory();

  const {mutate: createCase, isLoading} = useCreateCase();
  const {mutate: updateCase} = useUpdateCase(submitcase ? submitcase.id : "0");
  const {mutate: createRegistrationModule, isLoading: isLoadingReport} =
    useCreateReportname();
  const [tabIndex, setTabIndex] = useState<number>(0);

  const [company, setCompany] = useState<InsurerData>();
  const [members, setMembers] = useState<MemberType[]>([]);
  const [adjusters, setAdjusters] = useState<AdjusterType[]>([]);
  const [brokers, setBrokers] = useState<BrokerType[]>([]);
  const [vendor, setVendor] = useState<VendorType>();

  const [index, setIndex] = useState<number>(0);
  const [indexMember, setIndexMember] = useState<number>(0);
  const [companyComplete, setCompanyComplete] = useState<number>(0);
  const [totalPagination, setTotalPagination] = useState<number>(0);

  useEffect(() => {
    const total =
      tabIndex == 0
        ? members?.length
        : tabIndex == 1
        ? adjusters.length
        : tabIndex == 2
        ? brokers.length
        : 0;
    setTotalPagination(total);
  }, [tabIndex, adjusters, brokers, members]);

  const onSubmit = () => {
    let leader = {
      id: company?.id,
      share: company?.share,
    };
    let newMembers = members.map((val) => {
      return {
        id: val.id,
        share: val.share,
      };
    });

    if (submitcase) {
      updateCase(
        {
          company_id: company?.id,
          adjuster_ids: adjusters
            .filter((adjuster) => adjuster.id != 0)
            .map((adjuster) => adjuster.id),
          broker_ids: brokers
            .filter((broker) => broker.id != 0)
            .map((broker) => broker.id),
          vendor_id: vendor?.id,
          leader,
          members: leader.share === 100 ? [] : newMembers,
        },
        {
          onSuccess: (data) => {
            message.success("Success Update Case");

            createRegistrationModule(
              {
                report_name: "Registration Module",
                case_id: data.id,
                status: "Done",
              },
              {
                onSuccess: () => {
                  route.push("/submitted-case/");
                  // setOpenAddCase(false);
                },
              },
            );
          },
          onError: () => {
            // setError("role", {
            //   type: "errorResponse",
            //   message: "Something went wrong!. Please try again.",
            // });
          },
        },
      );
    } else {
      createCase(
        {
          company_id: company?.id,
          adjuster_ids: adjusters
            .filter((adjuster) => adjuster.id != 0)
            .map((adjuster) => adjuster.id),
          broker_ids: brokers
            .filter((broker) => broker.id != 0)
            .map((broker) => broker.id),
          vendor_id: vendor?.id,
          leader,
          members: leader.share === 100 ? [] : newMembers,
        },
        {
          onSuccess: (data) => {
            message.success("Success Create Case");

            createRegistrationModule(
              {
                report_name: "Registration Module",
                case_id: data.id,
                status: "Done",
              },
              {
                onSuccess: () => {
                  route.push("/submitted-case/" + data.id);
                  // setOpenAddCase(false);
                },
              },
            );
          },
          onError: () => {
            // setError("role", {
            //   type: "errorResponse",
            //   message: "Something went wrong!. Please try again.",
            // });
          },
        },
      );
    }
  };

  useEffect(() => {
    if (submitcase) {
      setAdjusters(submitcase.adjusters);

      setBrokers(submitcase.brokers);
    }
  }, [submitcase]);

  return (
    <div>
      <span className="text-2xl font-medium">
        {submitcase ? "Edit" : "Add"} Case
      </span>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "#",
          },
          {
            title: "Case",
            href: "/submitted-case",
          },
          {
            title: "Submitted Case",
            href: "/submitted-case",
          },
          {
            title: (submitcase ? "Edit" : "Add") + " Case",
          },
        ]}
      />
      <div className="w-full mt-6 mb-24 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
        <div className="pt-4 pb-5">
          <span className="pl-5 text-xl">Database Module</span>
          <Divider className="mt-4 mb-0" />
        </div>
        <div>
          <div className="tab-group pl-7 flex gap-3 text-base font-medium">
            <Button
              size="large"
              color="secondary"
              className={cx("rounded-b-none", {
                "bg-primary-500": tabIndex == 0,
              })}
              onClick={() => {
                setTabIndex(0);
              }}>
              1. General Database
            </Button>
            <Button
              size="large"
              color="secondary"
              className={cx("rounded-b-none", {
                "bg-primary-500": tabIndex == 1,
              })}
              disabled={company == undefined || companyComplete !== 1}
              onClick={() => {
                setTabIndex(1);
              }}>
              2. Adjuster Database
            </Button>
            <Button
              size="large"
              color="secondary"
              className={cx("rounded-b-none", {
                "bg-primary-500": tabIndex == 2,
              })}
              disabled={company == undefined || adjusters[0].name == ""}
              onClick={() => {
                setTabIndex(2);
              }}>
              3. Broker Database
            </Button>
            <Button
              size="large"
              color="secondary"
              className={cx("rounded-b-none", {
                "bg-primary-500": tabIndex == 3,
              })}
              disabled={
                company == undefined ||
                adjusters[0].name == "" ||
                brokers[0].name == ""
              }
              onClick={() => {
                setTabIndex(3);
              }}>
              4. Insured Database
            </Button>
          </div>
          <Divider className="m-0" />
          <GeneralDatabaseTab
            company={submitcase?.company}
            members={members}
            isOpenTab={tabIndex == 0}
            setCompany={setCompany}
            setMembers={setMembers}
            index={indexMember}
            setIndex={setIndexMember}
            companyComplete={companyComplete}
            setCompanyComplete={setCompanyComplete}
          />
          <AdjusterTeamDatabaseTab
            isOpenTab={tabIndex == 1}
            adjusters={adjusters}
            setAdjusters={setAdjusters}
            index={index}
            setIndex={setIndex}
          />
          <BrokerNameAddressTab
            isOpenTab={tabIndex == 2}
            brokers={brokers}
            setBrokers={setBrokers}
            index={index}
            setIndex={setIndex}
          />
          <InsuredNameTab
            insured={submitcase?.vendor}
            isOpenTab={tabIndex == 3}
            setVendor={setVendor}
          />
          <div className="items-center flex py-10 gap-2 pl-7 pr-36">
            <Pagination
              onChange={(page) =>
                tabIndex == 0 ? setIndexMember(page - 1) : setIndex(page - 1)
              }
              className={cx({
                hidden: tabIndex == 2 || tabIndex == 3,
              })}
              prevIcon="Previous"
              nextIcon="Next"
              current={tabIndex == 0 ? indexMember + 1 : index + 1}
              pageSize={1}
              total={totalPagination}
            />
            <Button
              className="ml-auto"
              size="large"
              color="outline"
              onClick={() => route.push("/submitted-case")}>
              Cancel
            </Button>
            {tabIndex == 3 ? (
              <Button
                disabled={
                  company == undefined ||
                  adjusters[0].name == "" ||
                  brokers[0].name == "" ||
                  vendor == undefined
                }
                size="large"
                loading={isLoading || isLoadingReport}
                onClick={() => onSubmit()}>
                Save
              </Button>
            ) : (
              <Button
                size="large"
                disabled={
                  !(
                    (tabIndex == 0 &&
                      company != undefined &&
                      companyComplete === 1) ||
                    (tabIndex == 1 &&
                      company != undefined &&
                      adjusters[0].name != "") ||
                    (tabIndex == 2 &&
                      company != undefined &&
                      adjusters[0].name != "" &&
                      brokers[0].name != "")
                  )
                }
                onClick={() => setTabIndex(tabIndex + 1)}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCase;
