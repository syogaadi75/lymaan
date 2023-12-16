import {Breadcrumb, Button, Input, Space} from "antd";
import {AdjusterTypeApi} from "..";
import TableAdjusters from "./TableAdjusters";
import {CiSearch} from "react-icons/ci";
import {IoAddOutline, IoReload} from "react-icons/io5";
import {LuDownload} from "react-icons/lu";
import {HiOutlinePrinter} from "react-icons/hi2";

const AdjusterLists = ({
  adjusterData,
  openBulkUpload,
  openEditForm,
}: {
  adjusterData: AdjusterTypeApi[];
  openBulkUpload: () => void;
  openEditForm: (adjusterId: number) => void;
}) => {
  const breadcrumbs = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Database",
      href: "/adjusters",
    },
    {
      title: "Adjusters",
      href: "/adjusters",
    },
  ];
  return (
    <div className="pt-4 px-2">
      <h1 className="text-2xl font-medium pb-2">Adjusters</h1>
      <Breadcrumb items={breadcrumbs} separator=">" />
      <div className="my-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
        <Space className="py-4 px-4 flex flex-wrap items-center justify-between">
          <Space>
            <Button
              type="ghost"
              size="large"
              onClick={openBulkUpload}
              icon={<IoAddOutline size={23} />}
              className="bg-primary-400 text-white flex items-center gap-1">
              Bulk Upload
            </Button>
            <Button
              icon={<LuDownload size={21} />}
              type="ghost"
              size="large"
              className="bg-primary-400 text-white flex items-center gap-1">
              Export
            </Button>
            <Button
              icon={<HiOutlinePrinter size={22} />}
              type="ghost"
              size="large"
              className="bg-primary-400 text-white flex items-center gap-1">
              Print
            </Button>
            <Button
              icon={<IoReload size={22} />}
              type="ghost"
              size="large"
              className="bg-primary-400 text-white flex items-center gap-1">
              Reload
            </Button>
          </Space>
          <Input
            size="large"
            placeholder="Search..."
            prefix={<CiSearch size={20} color="grey" />}
          />
        </Space>
        <TableAdjusters data={adjusterData} openEditForm={openEditForm} />
      </div>
    </div>
  );
};

export default AdjusterLists;
