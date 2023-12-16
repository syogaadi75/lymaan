import {Pagination} from "antd";
import {AdjusterType} from "interfaces";
import {useState} from "react";
import {formatDate} from "utils";

const AdjusterTeamDatabaseTab = ({adjusters}: {adjusters: AdjusterType[]}) => {
  const [index, setIndex] = useState<number>(0);
  return (
    <>
      <ul className="ml-3 list-disc space-y-2 mb-4">
        <li>
          <div className="flex">
            <div className="w-64">Adjuster's Full Name</div>
            <div className="mr-10">:</div>
            <div className="">{adjusters[index].name}</div>
          </div>
        </li>
        <li>
          <div className="flex">
            <div className="w-64">Adjuster Address</div>
            <div className="mr-10">:</div>
            <div className="">{adjusters[index].address}</div>
          </div>
        </li>
        <li>
          <div className="flex">
            <div className="w-64">Adjuster's Phone Number</div>
            <div className="mr-10">:</div>
            <div className="">{adjusters[index].phone}</div>
          </div>
        </li>
        <li>
          <div className="flex">
            <div className="w-64">Adjuster's Email</div>
            <div className="mr-10">:</div>
            <div className="">{adjusters[index].email}</div>
          </div>
        </li>
        <li>
          <div className="flex">
            <div className="w-64">Adjuster's Date Joined</div>
            <div className="mr-10">:</div>
            <div className="">
              {formatDate(new Date(adjusters[index].created_at))}
            </div>
          </div>
        </li>
      </ul>
      <Pagination
        onChange={(page) => setIndex(page - 1)}
        current={index + 1}
        pageSize={1}
        total={adjusters.length}
      />
    </>
  );
};

export default AdjusterTeamDatabaseTab;
