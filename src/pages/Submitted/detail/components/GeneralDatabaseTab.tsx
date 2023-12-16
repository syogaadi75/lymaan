import {CompanyResponse, InsurerData} from "interfaces";

const GeneralDatabaseTab = ({company}: {company: InsurerData}) => {
  return (
    <ul className="ml-3 list-disc space-y-2">
      <li>
        <div className="flex">
          <div className="w-44">Insurer Name</div>
          <div className="mr-10">:</div>
          <div className="">{company.name}</div>
        </div>
      </li>
      <li>
        <div className="flex">
          <div className="w-44">Insurer Address</div>
          <div className="mr-10">:</div>
          <div className="">{company.address}</div>
        </div>
      </li>
      <li>
        <div className="flex">
          <div className="w-44">Insurer Contact</div>
          <div className="mr-10">:</div>
          <div className="">{company.contact}</div>
        </div>
      </li>
      <li>
        <div className="flex">
          <div className="w-44">Person in Charge</div>
          <div className="mr-10">:</div>
          <div className="">{company.person_incharge}</div>
        </div>
      </li>
      <li>
        <div className="flex">
          <div className="w-44">Email Address</div>
          <div className="mr-10">:</div>
          <div className="">{company.email}</div>
        </div>
      </li>
      <li>
        <div className="flex">
          <div className="w-44">Phone Number</div>
          <div className="mr-10">:</div>
          <div className="">{company.phone}</div>
        </div>
      </li>
      <li>
        <div className="flex">
          <div className="w-44">Insurer Website</div>
          <div className="mr-10">:</div>
          <div className="">{company.website}</div>
        </div>
      </li>
    </ul>
  );
};

export default GeneralDatabaseTab;
