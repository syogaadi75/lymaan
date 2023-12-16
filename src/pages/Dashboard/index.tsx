import {Card, Table} from "antd";
import {HiOutlineArrowRight} from "react-icons/hi";
import {
  UsersIcon,
  RoleIcon,
  FolderIcon,
  CreditCardIcon,
} from "./components/DashboardIcons";
import {TableLastEditedForm, TableWaitingForPayment} from "./components/Table";
import {useGetListRoles, useGetListUsers} from "hooks/query";
import {useHistory} from "react-router";
import {defaultApiListOptions} from "interfaces";

const DashboardPage = () => {
  const {push} = useHistory();
  const {data: listUsers} = useGetListUsers(defaultApiListOptions);
  const {data: listRoles} = useGetListRoles(defaultApiListOptions);

  return (
    <div>
      <span className="text-2xl font-medium">Dashboard</span>
      <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4">
        <Card
          className="bg-primary-300 text-white text-base overflow-hidden cursor-pointer"
          onClick={() => push("/users")}>
          <UsersIcon />
          <p className="relative z-10">Total User</p>
          <p className="text-2xl font-bold relative z-10">
            {listUsers?.data?.length ? listUsers.data.length : "-"}
          </p>
          <div className="mt-5 flex justify-between relative z-10">
            <p className="text-xs">Updated hour ago</p>
            <HiOutlineArrowRight />
          </div>
        </Card>
        <Card
          className="bg-[#5b9075] text-white text-base overflow-hidden cursor-pointer"
          onClick={() => push("/roles")}>
          <RoleIcon />
          <p className="relative z-10">Total Roles</p>
          <p className="text-2xl font-bold relative z-10">
            {listRoles?.data?.length ? listRoles.data.length : "-"}
          </p>
          <div className="mt-5 flex justify-between relative z-10">
            <p className="text-xs">Updated hour ago</p>
            <HiOutlineArrowRight />
          </div>
        </Card>
        <Card className="bg-[#905b5b] text-white text-base overflow-hidden cursor-pointer">
          <FolderIcon />
          <p className="relative z-10">Total Case Active</p>
          <p className="text-2xl font-bold relative z-10">4</p>
          <div className="mt-5 flex justify-between relative z-10">
            <p className="text-xs">Updated hour ago</p>
            <HiOutlineArrowRight />
          </div>
        </Card>
        <Card className="bg-[#907e5b] text-white text-base overflow-hidden cursor-pointer">
          <CreditCardIcon />
          <p className="relative z-10">Pending Payments</p>
          <p className="text-2xl font-bold relative z-10">4</p>
          <div className="mt-5 flex justify-between relative z-10">
            <p className="text-xs">Updated hour ago</p>
            <HiOutlineArrowRight />
          </div>
        </Card>
      </div>
      <div
        id="table"
        className="my-6 flex flex-col md:flex-row gap-8 min-w-inherit">
        <div
          id="table_last_edited_form"
          className="bg-white flex flex-col md:basis-3/5 rounded-lg 
          shadow-[0_0_30px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="mx-6 my-4 flex justify-between">
            <span className="text-lg font-medium">Last Edited Form</span>
            <div className="flex items-center gap-2 text-[#adadad]">
              <span className="cursor-pointer text-xs font-medium">
                View More
              </span>
              <HiOutlineArrowRight size={24} />
            </div>
          </div>
          <Table
            columns={TableLastEditedForm.columns}
            dataSource={TableLastEditedForm.data}
            pagination={false}
            scroll={{x: "100%"}}
          />
        </div>
        <div
          id="table_waiting_for_payment"
          className="bg-white flex flex-col md:basis-2/5 rounded-lg 
          shadow-[0_0_30px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="mx-6 my-4 flex justify-between">
            <span className="text-lg font-medium">Waiting For Payment</span>
            <div className="flex items-center gap-2 text-[#adadad]">
              <span className="cursor-pointer text-xs font-medium">
                View More
              </span>
              <HiOutlineArrowRight size={24} />
            </div>
          </div>
          <Table
            columns={TableWaitingForPayment.columns}
            dataSource={TableWaitingForPayment.data}
            pagination={false}
            scroll={{x: "100%"}}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
