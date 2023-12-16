import {Spin} from "antd";
import {useGetReportname, useGetSubmitCase} from "hooks/query";
import {useParams} from "react-router";
import CreateRegistrationReportCard from "./components/CreateRegistrationReportCard";
import CreateReportCard from "./components/CreateReportCard";
import {Breadcrumb} from "components/ui";
import CreateUpdatingReportCard from "./components/CreateUpdatingReportCard";
import {formatNumberPrefixZero} from "utils";

type ReportParams = {
  id: string;
  report_id: string;
};

const ReportPage = () => {
  const {id, report_id} = useParams<ReportParams>();

  const {data: dataSubmitcase, isLoading: isLoadingSubmitcase} =
    useGetSubmitCase(id);

  const {data: dataReportname, isLoading: isLoadingReportname} =
    useGetReportname(report_id);

  return (
    <div>
      <div className="text-2xl font-medium">
        {dataReportname?.data.report_name}
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
          },
          {
            title: "Submitted Case",
            href: "/submitted-case",
          },
          {
            title:
              dataSubmitcase?.company.name +
              " (" +
              formatNumberPrefixZero(parseInt(dataSubmitcase?.id ?? "0")) +
              ")",
            href: "/submitted-case/" + dataSubmitcase?.id,
          },
          {
            title: dataReportname?.data.report_name,
          },
        ]}
      />

      {isLoadingReportname ||
      isLoadingSubmitcase ||
      !dataSubmitcase ||
      dataReportname?.data == undefined ? (
        <Spin />
      ) : dataReportname?.data.report_name == "Registration Module" ? (
        <CreateRegistrationReportCard
          dataReportname={dataReportname.data}
          dataSubmitcase={dataSubmitcase}
        />
      ) : dataReportname?.data.report_name == "Updating Module" ? (
        <CreateUpdatingReportCard
          dataReportname={dataReportname.data}
          dataSubmitcase={dataSubmitcase}
        />
      ) : (
        <CreateReportCard
          dataSubmitcase={dataSubmitcase}
          dataReportname={dataReportname.data}
        />
      )}
    </div>
  );
};

export default ReportPage;
