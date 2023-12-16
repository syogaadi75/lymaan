import {Button, PaginationProps} from "antd";
import Table, {ColumnsType} from "antd/es/table";
import {CashAdvanceData} from "interfaces";
import React, {useState} from "react";
// icons
import {ReactComponent as DetailIcon} from "public/icons/dots-horizontal.svg";
import {useDisclosure} from "hooks";
import DetailBudgetDialog from "pages/CashAdvance/cashadvance/components/DetailBudgetDialog";
import {formatDate, formatPrice} from "utils";

export interface ColumnDataType extends CashAdvanceData {
  key: React.Key;
  no: React.Key;
  action: React.ReactElement;
}

const ActionButtons = ({
  handleDetail,
}: {
  id: number;
  handleDetail: () => void;
}) => {
  return (
    <Button
      onClick={handleDetail}
      htmlType="button"
      type="default"
      className="bg-primary-100 w-9 h-9 rounded-lg p-[6px]">
      <DetailIcon />
    </Button>
  );
};

const dataFrom = (
  data: CashAdvanceData[],
  handleDetail: (index: number) => void,
): ColumnDataType[] => {
  return (
    data?.map((_data, index) => ({
      ..._data,
      key: index,
      no: index,
      created_at: formatDate(new Date(_data.created_at)),
      progress: "FRS",
      action: (
        <ActionButtons id={_data.id} handleDetail={() => handleDetail(index)} />
      ),
    })) ?? []
  );
};

const itemRender: PaginationProps["itemRender"] = (
  _,
  type,
  originalElement,
) => {
  if (type === "prev") {
    return <a>Previous</a>;
  }
  if (type === "next") {
    return <a>Next</a>;
  }
  return originalElement;
};

const column: ColumnsType<ColumnDataType> = [
  {
    title: "No",
    dataIndex: "no",
    render: (index) => index + 1,
  },
  {
    title: "Name",
    dataIndex: ["name"],
  },
  {
    title: "Role",
    dataIndex: ["roles"],
  },
  {
    title: "Type",
    dataIndex: ["type"],
  },
  {
    title: "Nominal",
    dataIndex: ["nominal"],
    render: (_data, record) => formatPrice(parseFloat(record.nominal)),
  },
  {
    title: "Attachment",
    dataIndex: ["signature"],
  },
  {
    title: "Date",
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

export default function ListTable({
  data,
  isLoading,
}: {
  data: CashAdvanceData[];
  isLoading: boolean;
}) {
  const [indexDetail, setIndexDetail] = useState<number | null>(null);
  const {isOpen, onClose, onOpen} = useDisclosure();

  const handleDetail = (index: number) => {
    onOpen();
    setIndexDetail(index);
  };

  const dataSource: ColumnDataType[] = dataFrom(data, handleDetail);

  return (
    <>
      <Table
        columns={column}
        dataSource={dataSource}
        pagination={{
          position: ["bottomCenter"],
          defaultPageSize: 10,
          showSizeChanger: true,
          itemRender: itemRender,
          pageSizeOptions: ["10", "20", "30", "40", "50"],
        }}
        loading={isLoading}
      />
      <DetailBudgetDialog
        isOpen={isOpen && indexDetail != null}
        toggle={onClose}
        cashAdvance={indexDetail != null ? data[indexDetail] : null}
      />
    </>
  );
}
