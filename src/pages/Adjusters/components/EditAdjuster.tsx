import {Breadcrumb, Button, Divider, Input, Space} from "antd";
import {AdjusterTypeApi} from "..";
import {InputField} from "components/hookform";
import {useEffect, useState} from "react";

const EditAdjuster = ({
  oldDataAdjuster,
  closeEditForm,
}: {
  oldDataAdjuster: AdjusterTypeApi[];
  closeEditForm: () => void;
}) => {
  const {TextArea} = Input;
  const [updatedAdjusterDatas, setUpdatedAdjusterDatas] = useState<
    AdjusterTypeApi[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formInitState, setFormInitState] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    join_date: "",
  });

  useEffect(() => {
    oldDataAdjuster.map((adjuster) => {
      setFormInitState({
        name: adjuster.name,
        email: adjuster.email,
        address: adjuster.address,
        phone: adjuster.phone,
        join_date: adjuster.join_date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      });
    });
  }, []);

  useEffect(() => {
    oldDataAdjuster.map((data: AdjusterTypeApi) => {
      setSelectedDate(data.join_date);
    });
  }, []);

  const breadcrumbItems = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Database",
      href: "/adjusters",
    },
    {
      title: "Adjuster",
      href: "/adjusters",
    },
    {title: "Edit Adjuster"},
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof AdjusterTypeApi,
  ) => {
    const {value} = e.target;
    setFormInitState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateObj = new Date(event.target.value);
    setSelectedDate(dateObj);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitted form value : ", formInitState);
  };
  return (
    <div className="w-full mt-6 mb-16">
      <h1 className="text-2xl font-medium pb-1.5">Edit Adjuster</h1>
      <Breadcrumb items={breadcrumbItems} separator=">" />
      <div className="shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg mt-6">
        <h1 className="pt-6 px-7 text-xl font-medium">Adjuster Database</h1>
        <Divider className="pb-1" />
        <form onSubmit={handleFormSubmit} className="px-7 pb-7">
          <InputField
            type="text"
            name="name"
            value={formInitState.name}
            onChange={(e) => handleInputChange(e, "name")}
            label="Adjuster Full Name"
            labelclassName="text-md font-medium"
          />
          <Space direction="vertical" className="w-full my-5" size={12}>
            <label htmlFor="address" className="text-md font-medium">
              Adjuster Address
            </label>
            <TextArea
              name="address"
              onChange={(e) => handleInputChange(e, "address")}
              value={formInitState.address}
              rows={6}
            />
          </Space>
          <InputField
            type="email"
            name="email"
            value={formInitState.email}
            onChange={(e) => handleInputChange(e, "email")}
            label="Adjuster Email"
            labelclassName="text-md font-medium"
          />
          <InputField
            type="tel"
            name="phone"
            value={formInitState.phone}
            onChange={(e) => handleInputChange(e, "phone")}
            label="Adjuster Phone Number"
            labelclassName="text-md font-medium mt-5"
          />
          <InputField
            type="date"
            label="Adjuster Date Joined"
            labelclassName="text-md font-medium mt-5"
            onChange={handleDateChange}
            value={selectedDate.toISOString().slice(0, 10)}
          />
          <Space className="mt-6 flex justify-end">
            <Button
              type="ghost"
              onClick={closeEditForm}
              className="bg-primary-100 text-white">
              Cancel
            </Button>
            <Button
              type="ghost"
              htmlType="submit"
              className="bg-primary-300 text-white">
              Save
            </Button>
          </Space>
        </form>
      </div>
    </div>
  );
};

export default EditAdjuster;
