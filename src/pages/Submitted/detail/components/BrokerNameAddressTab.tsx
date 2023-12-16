import {BrokerType} from "interfaces";
import {useState} from "react";

const BrokerNameAddressTab = ({brokers}: {brokers: BrokerType[]}) => {
  const [index] = useState<number>(0);
  return (
    <>
      <ul className="ml-3 list-disc space-y-2 mb-4">
        <li>
          <div className="flex">
            <div className="w-64">Broker's Full Name</div>
            <div className="mr-10">:</div>
            <div className="">{brokers[index].name}</div>
          </div>
        </li>
        <li>
          <div className="flex">
            <div className="w-64">Broker's Address</div>
            <div className="mr-10">:</div>
            <div className="">{brokers[index].address}</div>
          </div>
        </li>
        <li>
          <div className="flex">
            <div className="w-64">Broker's Phone Number</div>
            <div className="mr-10">:</div>
            <div className="">{brokers[index].phone}</div>
          </div>
        </li>
        <li>
          <div className="flex">
            <div className="w-64">Broker's Insurer</div>
            <div className="mr-10">:</div>
            <div className="">{brokers[index].company}</div>
          </div>
        </li>
        <li>
          <div className="flex">
            <div className="w-64">Broker's Affiliation / Source</div>
            <div className="mr-10">:</div>
            <div className="">{brokers[index].affiliation}</div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default BrokerNameAddressTab;
