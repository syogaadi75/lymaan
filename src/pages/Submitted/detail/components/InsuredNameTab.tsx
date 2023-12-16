import {VendorType} from "interfaces";

const InsuredNameTab = ({vendor}: {vendor: VendorType}) => {
  return (
    <ul className="ml-3 list-disc space-y-2">
      <li>
        <div className="flex">
          <div className="w-44">Insured Name</div>
          <div className="mr-10">:</div>
          <div className="">{vendor.name}</div>
        </div>
      </li>
      <li>
        <div className="flex">
          <div className="w-44">Insured Address</div>
          <div className="mr-10">:</div>
          <div className="">{vendor.address}</div>
        </div>
      </li>
      <li>
        <div className="flex">
          <div className="w-44">Insured Contact</div>
          <div className="mr-10">:</div>
          <div className="">{vendor.phone}</div>
        </div>
      </li>
      <li>
        <div className="flex">
          <div className="w-44">Insured Email</div>
          <div className="mr-10">:</div>
          <div className="">{vendor.email}</div>
        </div>
      </li>
      <li>
        <div className="flex">
          <div className="w-44">Insured PIC</div>
          <div className="mr-10">:</div>
          <div className="">{vendor.pic}</div>
        </div>
      </li>
      <li>
        <div className="flex">
          <div className="w-44">Insurer Website</div>
          <div className="mr-10">:</div>
          <div className="">{vendor.website}</div>
        </div>
      </li>
    </ul>
  );
};

export default InsuredNameTab;
