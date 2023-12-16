import {Divider, Spin} from "antd";
import {ReactNode, useState} from "react";
import cx from "classnames";
import {useParams} from "react-router";
import {useGetSubmitCase} from "hooks/query";
import {Breadcrumb} from "components/ui";
import GeneralDatabaseTab from "./components/GeneralDatabaseTab";
import AdjusterTeamDatabaseTab from "./components/AdjusterTeamDatabaseTab";
import BrokerNameAddressTab from "./components/BrokerNameAddressTab";
import InsuredNameTab from "./components/InsuredNameTab";
import TableReports from "./components/TableReports";
import {formatNumberPrefixZero} from "utils";

type DetailCaseParams = {
  id: string;
};

const DetailCasePage = () => {
  const {id} = useParams<DetailCaseParams>();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const {data, isLoading: isLoadingDetail} = useGetSubmitCase(id);

  const tab: {[key: string]: ReactNode} = data
    ? {
        0: <GeneralDatabaseTab company={data.company} />,
        1: <AdjusterTeamDatabaseTab adjusters={data.adjusters} />,
        2: <BrokerNameAddressTab brokers={data.brokers} />,
        3: <InsuredNameTab vendor={data.vendor} />,
      }
    : {};

  return (
    <div>
      <div className="text-2xl font-medium">
        {data?.company.name} (
        {formatNumberPrefixZero(parseInt(data?.id ?? "0"))})
      </div>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "Case",
            href: "",
          },
          {
            title: "Submitted Case",
            href: "/submitted-case",
          },
          {
            title:
              data?.company.name +
              " (" +
              formatNumberPrefixZero(parseInt(data?.id ?? "0")) +
              ")",
          },
        ]}
      />
      <div className="w-full mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
        <div className="pt-4 pb-5">
          <span className="pl-5 text-xl">Database Module</span>
          <Divider className="mt-4 mb-0" />
        </div>
        <div>
          {isLoadingDetail ? (
            <Spin tip="Loading" size="small">
              <div className="content" />
            </Spin>
          ) : (
            <>
              <div className="tab-group pl-7 flex gap-3 text-base font-medium">
                <button
                  className={cx(
                    "py-2 w-48 rounded-t-lg border-none text-primary-200 bg-[#f0f7ff] hover:text-white hover:bg-primary-400",
                    {"text-white bg-primary-400": tabIndex == 0},
                  )}
                  type="button"
                  onClick={() => {
                    setTabIndex(0);
                  }}>
                  General Data Base
                </button>
                <button
                  className={cx(
                    "py-2 w-56 rounded-t-lg border-none text-primary-200 bg-[#f0f7ff] hover:text-white hover:bg-primary-400",
                    {"text-white bg-primary-400": tabIndex == 1},
                  )}
                  type="button"
                  onClick={() => {
                    setTabIndex(1);
                  }}>
                  Adjuster Team Data Base
                </button>
                <button
                  className={cx(
                    "py-2 w-56 rounded-t-lg border-none text-primary-200 bg-[#f0f7ff] hover:text-white hover:bg-primary-400",
                    {"text-white bg-primary-400": tabIndex == 2},
                  )}
                  type="button"
                  onClick={() => {
                    setTabIndex(2);
                  }}>
                  Broker Name & Address
                </button>
                <button
                  className={cx(
                    "py-2 w-56 rounded-t-lg border-none text-primary-200 bg-[#f0f7ff] hover:text-white hover:bg-primary-400",
                    {"text-white bg-primary-400": tabIndex == 3},
                  )}
                  type="button"
                  onClick={() => {
                    setTabIndex(3);
                  }}>
                  Insured Name (Insured)
                </button>
              </div>
              <Divider className="m-0" />
              <div className="py-4 px-8">{tab[tabIndex]}</div>
            </>
          )}
        </div>
      </div>

      <TableReports id={id} />
    </div>
  );
};

export default DetailCasePage;
