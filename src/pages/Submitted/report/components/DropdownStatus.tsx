import {Button, Divider, Dropdown, MenuProps, Space, message} from "antd";
import {ReportnameResponse, StatusesCase, bgColorStatus} from "interfaces";
import React, {useState} from "react";
import {FaChevronDown} from "react-icons/fa";
import {useParams} from "react-router";
import {reportnameAPI} from "services";

type ReportParams = {
  id: string;
  report_id: string;
};

type DropdownStatusProps = {
  dataReportname: ReportnameResponse;
};

const DropdownStatus = ({dataReportname}: DropdownStatusProps) => {
  const {report_id} = useParams<ReportParams>();
  const [statuses, setStatuses] = useState(dataReportname.status);

  const onUpdateStatuses = (status: string) => {
    reportnameAPI
      .updateReportname(report_id, {
        report_name: dataReportname.report_name,
        status: status,
        case_id: dataReportname.case_id,
      })
      .then(() => {
        message.success("Success Change Status");
        setStatuses(status);
      });
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <div className="flex items-center gap-1">
          <div className="bg-gray-300 w-3 h-3"></div>BACKLOG
        </div>
      ),
      key: "Backlog",
    },
    {
      label: (
        <div className="flex items-center gap-1">
          <div className="bg-red-500 w-3 h-3"></div>PENDING
        </div>
      ),
      key: "Pending",
    },
    {
      label: (
        <div className="flex items-center gap-1">
          <div className="bg-yellow-400 w-3 h-3"></div>IN PROGRESS
        </div>
      ),
      key: "In Progress",
    },
    {
      label: (
        <div className="flex items-center gap-1">
          <div className="bg-blue-500 w-3 h-3"></div>IN REVIEW
        </div>
      ),
      key: "In Review",
    },
    {
      label: (
        <div className="flex items-center gap-1">
          <div className="bg-purple-600 w-3 h-3"></div>REJECTED
        </div>
      ),
      key: "Rejected",
    },
    {
      label: (
        <div className="flex items-center gap-1">
          <div className="bg-green-600 w-3 h-3"></div>DONE
        </div>
      ),
      key: "Done",
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    onUpdateStatuses(e.key);
    setStatuses(e.key);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Dropdown
      menu={menuProps}
      dropdownRender={(menu) => (
        <div className="bg-white border rounded">
          <div className="p-2 text-center">Statuses</div>
          <Divider style={{margin: 0}} />
          {React.cloneElement(menu as React.ReactElement, {
            style: {boxShadow: "none"},
          })}
        </div>
      )}>
      <Button className={bgColorStatus[statuses.toLowerCase() as StatusesCase]}>
        <Space>
          {statuses}
          <FaChevronDown />
        </Space>
      </Button>
    </Dropdown>
  );
};

export default DropdownStatus;
