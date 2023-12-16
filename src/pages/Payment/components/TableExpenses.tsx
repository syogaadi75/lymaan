import {ColumnsType} from "antd/es/table";
import {PaginationProps, Table} from "antd";
import {formatDate, formatNumberWithCurrency} from "utils";
import {ExpensesData} from "interfaces";

interface DataTableExpenses {
  id: number;
  case_id: string;
  expenses: string;
  type: string;
  nominal: string;
  attachment: string;
  created_at: string;
  updated_at: string;
}

export const TableExpenses = ({
  expensesDatas,
  selectedCurrency,
}: {
  expensesDatas: ExpensesData[] | undefined;
  selectedCurrency: string;
}) => {
  const columns: ColumnsType<DataTableExpenses> = [
    {
      title: "No",
      dataIndex: "no",
      render: (_, record, index) => index + 1,
    },
    {
      title: "Expenses",
      dataIndex: ["expenses"],
      sorter: {
        compare: (a, b) => a.expenses.localeCompare(b.expenses),
      },
    },
    {
      title: "Type",
      dataIndex: ["type"],
      sorter: {
        compare: (a, b) => a.type.localeCompare(b.type),
      },
    },
    {
      title: "Nominal",
      dataIndex: ["nominal"],
      sorter: {
        compare: (a, b) =>
          formatNumberWithCurrency(
            parseInt(a.nominal),
            selectedCurrency,
          ).localeCompare(
            formatNumberWithCurrency(parseInt(b.nominal), selectedCurrency),
          ),
      },
    },
    {
      title: "Attachment",
      dataIndex: ["attachment"],
      sorter: {
        compare: (a, b) => a.attachment.localeCompare(b.attachment),
      },
    },
    {
      title: "Date",
      dataIndex: "created_at",
      sorter: {
        compare: (a, b) =>
          formatDate(new Date(a.created_at)).localeCompare(
            formatDate(new Date(b.created_at)),
          ),
      },
    },
  ];

  const dataSource: DataTableExpenses[] | undefined = expensesDatas?.map(
    (data, index: number) => {
      return {
        key: index,
        id: data.id,
        case_id: data.case_id.toString(),
        expenses: data.expenses,
        type: data.type,
        nominal: formatNumberWithCurrency(
          parseInt(data.nominal),
          selectedCurrency,
        ),
        attachment: data.attachment,
        created_at: formatDate(new Date(data.created_at)),
        updated_at: formatDate(new Date(data.updated_at)),
      };
    },
  );

  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement,
  ) => {
    if (type === "prev") return <a>Previous</a>;
    if (type === "next") return <a>Next</a>;
    return originalElement;
  };

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          defaultPageSize: 5,
          showSizeChanger: true,
          itemRender: itemRender,
          pageSizeOptions: ["10", "20", "25", "50", "75", "100"],
        }}
      />
    </>
  );
};
