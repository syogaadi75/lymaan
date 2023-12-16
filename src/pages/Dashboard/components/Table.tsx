import type {ColumnsType, TableProps} from "antd/es/table";

interface DataTypeCommon {
  key: React.Key;
  no: number;
  createdAt: string;
  status: string;
}

interface DataTypeLastEditedForm extends DataTypeCommon {
  nameReport: string;
  nameCompany: string;
}

interface DataTypeWaitingForPayment extends DataTypeCommon {
  company: string;
}

interface ITable<T> {
  columns: ColumnsType<T>;
  data: T[];
  onChange?: TableProps<T>["onChange"];
}

type ITableLastEditedForm = ITable<DataTypeLastEditedForm>;
type ITableWaitingForPayment = ITable<DataTypeWaitingForPayment>;

/**
 * TODO : Implement sort function for the "status" column in
 * the table once the different types of status are known.
 */
export const TableLastEditedForm: ITableLastEditedForm = {
  columns: [
    {
      title: "No",
      dataIndex: "no",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Name Report",
      dataIndex: "nameReport",
      sorter: {
        compare: (a, b) => a.nameReport.localeCompare(b.nameReport),
      },
    },
    {
      title: "Name Company",
      dataIndex: "nameCompany",
      sorter: {
        compare: (a, b) => a.nameCompany.localeCompare(b.nameCompany),
      },
    },
    {
      title: "created At",
      dataIndex: "createdAt",
      sorter: {
        compare: (a, b) =>
          new Date(a.createdAt)
            .toString()
            .localeCompare(new Date(b.createdAt).toString()),
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ],
  data: [
    {
      key: "1",
      no: 1,
      nameReport: "First Survey Report",
      nameCompany: "PT. INDRAMAYU JAYA",
      createdAt: "May 13, 2023 6:35 AM",
      status: "Done",
    },
    {
      key: "2",
      no: 2,
      nameReport: "Preeliminary Report",
      nameCompany: "PT. MAJU BERSAMA",
      createdAt: "May 13, 2023 6:35 AM",
      status: "Done",
    },
    {
      key: "3",
      no: 3,
      nameReport: "Draft Final Report",
      nameCompany: "PT. PHAPROS",
      createdAt: "May 13, 2023 6:35 AM",
      status: "Done",
    },
    {
      key: "4",
      no: 4,
      nameReport: "Final Report",
      nameCompany: "CV. DNS TECHNOLOGY",
      createdAt: "May 13, 2023 6:35 AM",
      status: "Done",
    },
  ],
};

/**
 * TODO : Implement sort function for the "status" column in the table
 * once the different types of status are known.
 */
export const TableWaitingForPayment: ITableWaitingForPayment = {
  columns: [
    {
      title: "No",
      dataIndex: "no",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Company",
      dataIndex: "company",
      sorter: {
        compare: (a, b) => a.company.localeCompare(b.company),
      },
    },
    {
      title: "created At",
      dataIndex: "createdAt",
      sorter: {
        compare: (a, b) =>
          new Date(a.createdAt)
            .toString()
            .localeCompare(new Date(b.createdAt).toString()),
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ],
  data: [
    {
      key: "1",
      no: 1,
      company: "Client 1",
      createdAt: "May 13, 2023 6:35 AM",
      status: "Done",
    },
    {
      key: "2",
      no: 2,
      company: "Client 2",
      createdAt: "May 13, 2023 6:35 AM",
      status: "Done",
    },
    {
      key: "3",
      no: 3,
      company: "Client 3",
      createdAt: "May 13, 2023 6:35 AM",
      status: "Done",
    },
    {
      key: "4",
      no: 4,
      company: "Client 4",
      createdAt: "May 13, 2023 6:35 AM",
      status: "Done",
    },
  ],
};
