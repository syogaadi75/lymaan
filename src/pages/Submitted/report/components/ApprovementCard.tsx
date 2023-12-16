import {Divider} from "antd";
import {ColumnsType} from "antd/es/table";
import Table from "components/ui/Table";
import cx from "classnames";
import {ReportnameResponse} from "interfaces";
import {useEffect, useState} from "react";
import {formatDate} from "utils";

type TableColumnsType = {
  role: string;
  date: string;
  status: string;
};

const dataSourceDefault = [
  {
    role: "Tenaga Ahli",
    date: "",
    status: "Pending",
  },
  {
    role: "Direktur",
    date: "",
    status: "Pending",
  },
  {
    role: "Sekretaris",
    date: "",
    status: "Pending",
  },
];

const ApprovementCard = ({
  dataReportname,
}: {
  dataReportname: ReportnameResponse;
}) => {
  const [dataSource, setDataSource] = useState(dataSourceDefault);

  const columns: ColumnsType<TableColumnsType> = [
    {
      title: "Role",
      dataIndex: "role",
      sorter: {
        compare: (a, b) => a.role.localeCompare(b.role),
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: {
        compare: (a, b) => a.date.localeCompare(b.date),
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: {
        compare: (a, b) => a.status.localeCompare(b.status),
      },
      render: (_, record) => (
        <div
          className={cx("text-center rounded-lg py-1 font-medium", {
            "bg-orange-400 text-white":
              record.status.toLowerCase() == "pending",
            "bg-red-500 text-white": record.status.toLowerCase() == "rejected",
            "bg-green-600 text-white":
              record.status.toLowerCase() == "approved",
          })}>
          {record.status}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (dataReportname) {
      const dataSource = dataSourceDefault;

      if (
        new Date(dataReportname.approve_tenaga_ahli_date).getTime() >
        new Date(dataReportname.reject_tenaga_ahli_date).getTime()
      ) {
        dataSource[0].status = "Approved";
        dataSource[0].date = formatDate(
          dataReportname.approve_tenaga_ahli_date,
        );
      } else if (dataReportname.reject_tenaga_ahli_id) {
        dataSource[0].status = "Rejected";
        dataSource[0].date = formatDate(dataReportname.reject_tenaga_ahli_date);
      }

      if (
        new Date(dataReportname.approve_direktur_date).getTime() >
        new Date(dataReportname.reject_direktur_date).getTime()
      ) {
        dataSource[1].status = "Approved";
        dataSource[1].date = formatDate(dataReportname.approve_direktur_date);
      } else if (dataReportname.reject_direktur_id) {
        dataSource[1].status = "Rejected";
        dataSource[1].date = formatDate(dataReportname.reject_direktur_date);
      }

      if (
        new Date(dataReportname.approve_sekretaris_date).getTime() >
        new Date(dataReportname.reject_sekretaris_date).getTime()
      ) {
        dataSource[2].status = "Approved";
        dataSource[2].date = formatDate(dataReportname.approve_sekretaris_date);
      } else if (dataReportname.reject_sekretaris_id) {
        dataSource[2].status = "Rejected";
        dataSource[2].date = formatDate(dataReportname.reject_sekretaris_date);
      }

      setDataSource(dataSource);
    }
  }, [dataReportname]);

  return (
    <div className="w-full mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
      <div className="pt-4 pb-5">
        <span className="pl-5 text-xl">Approvement</span>
        <Divider className="mt-4 mb-0" />
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={false}
          title="Approve"
        />
      </div>
    </div>
  );
};

export default ApprovementCard;
