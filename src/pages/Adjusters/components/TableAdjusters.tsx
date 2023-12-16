import {useState} from "react";
import {AdjusterTypeApi, AdjusterTypeColumnTable, AdjusterTypeTable} from "..";

import {Button, Divider, Modal, PaginationProps, Space, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {BsThreeDots} from "react-icons/bs";
import {BiEdit, BiTrash} from "react-icons/bi";

const column: ColumnsType<AdjusterTypeTable> = [
  {
    title: "No",
    dataIndex: "no",
    render: (_, record, index) => index + 1,
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: {compare: (a, b) => a.name.localeCompare(b.name)},
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: {compare: (a, b) => a.email.localeCompare(b.email)},
  },
  {
    title: "Date Joined",
    dataIndex: "join_date",
    sorter: {compare: (a, b) => a.join_date.localeCompare(b.join_date)},
  },
  {title: "Action", dataIndex: "action"},
];

const ActionButtons = ({
  handleViewAction,
  handleEditAction,
  handleDeleteAction,
}: {
  handleViewAction: () => void;
  handleEditAction: () => void;
  handleDeleteAction: () => void;
}) => {
  return (
    <Space>
      <Button
        onClick={handleViewAction}
        type="ghost"
        className="bg-primary-100 text-white"
        icon={<BsThreeDots size={22} />}
      />
      <Button
        onClick={handleEditAction}
        type="ghost"
        className="bg-primary-100 text-white"
        icon={<BiEdit size={24} />}
      />
      <Button
        onClick={handleDeleteAction}
        type="ghost"
        className="bg-primary-100 text-white"
        icon={<BiTrash size={23} />}
      />
    </Space>
  );
};

const TableAdjusters = ({
  data,
  openEditForm,
}: {
  data: AdjusterTypeApi[];
  openEditForm: (adjusterId: number) => void;
}) => {
  const [updatedData, setUpdatedData] = useState<AdjusterTypeApi[]>([]);
  const [viewDataById, setViewDataById] = useState<AdjusterTypeApi[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUpdatedData([]);
  };

  const showAdjusterById = (adjusterId: number) => {
    setIsModalOpen(!isModalOpen);
    const filteredData = data.filter((data) => data.id === adjusterId);
    setViewDataById(filteredData);
  };

  const handleDeleteAdjuster = (adjusterId: number) => {
    if (adjusterId >= 0 && adjusterId < data.length) {
      data.splice(adjusterId, 1);
    }
    const modifiedArray = [...data];
    setUpdatedData(modifiedArray);
  };

  const formatDateAdjuster = (dateValue: Date) => {
    return dateValue.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const dataFrom = (
    adjusters: AdjusterTypeApi[],
  ): AdjusterTypeColumnTable[] => {
    return adjusters.map((data, index: number) => {
      return {
        key: data.id,
        id: data.id,
        no: index,
        name: data.name,
        address: data.address,
        email: data.email,
        phone: data.phone,
        join_date: formatDateAdjuster(data.join_date),
        action: (
          <ActionButtons
            handleDeleteAction={() => handleDeleteAdjuster(data.id)}
            handleViewAction={() => showAdjusterById(data.id)}
            handleEditAction={() => openEditForm(data.id)}
          />
        ),
      };
    });
  };

  const dataSource: AdjusterTypeColumnTable[] =
    updatedData.length > 1 ? dataFrom(updatedData) : dataFrom(data);

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
        columns={column}
        dataSource={dataSource}
        pagination={{
          position: ["bottomCenter"],
          itemRender: itemRender,
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "25", "50", "75", "100"],
        }}
      />
      <Modal
        title={
          <>
            <h1 className="text-xl font-semibold mb-0">
              Detail Database Adjuster
            </h1>
            <Divider className="mt-[24px]" />
          </>
        }
        width={600}
        centered
        open={isModalOpen}
        footer={null}
        onCancel={handleCloseModal}
        children={
          <>
            {viewDataById?.map((data, index: number) => (
              <ul key={index}>
                <li>
                  Adjuster's Full Name <span>: {data.name}</span>
                </li>
                <li>
                  Adjuster's Address <span>: {data.address}</span>
                </li>
                <li>
                  Adjuster's Phone Number <span>: {data.phone}</span>
                </li>
                <li>
                  Adjuster's Email <span>: {data.email}</span>
                </li>
                <li>
                  Adjuster's Date Joined{" "}
                  <span>
                    :{" "}
                    {data.join_date.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </li>
              </ul>
            ))}
          </>
        }
      />
    </>
  );
};

export default TableAdjusters;
