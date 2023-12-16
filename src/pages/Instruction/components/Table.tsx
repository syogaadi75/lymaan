import type {ColumnsType, TableProps} from "antd/es/table";

interface DataTypeCommon {
  key: React.Key;
  no: number;
  createddate: string;
  assignedto: string;
  description: string;
  status: string;
  action: string;
}

interface DataTypeInstruction extends DataTypeCommon {
  createddate: string;
}

interface ITable<T> {
  columns: ColumnsType<T>;
  data: T[];
  onChange?: TableProps<T>["onChange"];
}

type ITableInstruction = ITable<DataTypeInstruction>;

export const TableInstruction: ITableInstruction = {
  columns: [
    {
      title: "No",
      dataIndex: "no",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Created Date",
      dataIndex: "createddate",
      sorter: {
        compare: (a, b) => a.createddate.localeCompare(b.createddate),
      },
    },
    {
      title: "Assigned To",
      dataIndex: "assignedto",
      sorter: {
        compare: (a, b) => a.assignedto.localeCompare(b.assignedto),
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: {
        compare: (a, b) => a.description.localeCompare(b.description),
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: {
        compare: (a, b) => a.status.localeCompare(b.status),
      },
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ],
  data: [
    {
      key: "1",
      no: 1,
      createddate: "May 13, 2023 6:35 AM",
      assignedto: "Keuangan",
      description: "Buat Tagihan Asuransi",
      status: "Pending",
      action: "",
    },
    {
      key: "2",
      no: 2,
      createddate: "May 13, 2023 6:35 AM",
      assignedto: "Adjuster",
      description: "Buat Final Report",
      status: "Done",
      action: "",
    },
    {
      key: "3",
      no: 3,
      createddate: "May 13, 2023 6:35 AM",
      assignedto: "Keuangan",
      description: "Buat Tagihan Asuransi",
      status: "Done",
      action: "",
    },
    {
      key: "4",
      no: 4,
      createddate: "May 13, 2023 6:35 AM",
      assignedto: "Adjuster",
      description: "Buat Final Report",
      status: "Pending",
      action: "",
    },
  ],
};
