import {useState} from "react";
import AdjusterLists from "./components/AdjusterLists";
import BulkUploadAdjuster from "./components/BulkUploadAdjuster";
import EditAdjuster from "./components/EditAdjuster";
import AdjusterDatabase from "public/temp_database_adjuster.json";

export interface AdjusterTypeApi {
  id: number;
  no: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  join_date: Date;
}

export interface AdjusterTypeTable {
  id: number;
  no: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  join_date: string;
}

export interface AdjusterTypeColumnTable extends AdjusterTypeTable {
  key: React.Key;
  action: React.ReactElement;
}

const Adjusters = () => {
  const db_adjuster_temp: AdjusterTypeApi[] = AdjusterDatabase.map(
    (adjuster) => ({
      ...adjuster,
      join_date: new Date(adjuster.join_date),
    }),
  );

  const [formState, setFormState] = useState({
    isOpenForm: false,
    formAction: "",
  });

  const [editAdjusterData, setEditAdjusterData] = useState<AdjusterTypeApi[]>(
    [],
  );

  const {isOpenForm, formAction} = formState;

  const openBulkUpload = () =>
    setFormState((prevState) => {
      return {
        ...prevState,
        isOpenForm: true,
        formAction: "add",
      };
    });

  const closeBulkUpload = () =>
    setFormState((prevState) => {
      return {
        ...prevState,
        isOpenForm: false,
        formAction: "",
      };
    });

  const openEditAdjuster = (adjusterId: number) => {
    setFormState((prevState) => {
      return {
        ...prevState,
        isOpenForm: true,
        formAction: "edit",
      };
    });

    const filterData = db_adjuster_temp.filter(
      (data) => data.id === adjusterId,
    );

    setEditAdjusterData(filterData);
  };

  const closeEditAdjuster = () =>
    setFormState((prevState) => {
      return {
        ...prevState,
        isOpenForm: false,
        formAction: "",
      };
    });

  return (
    <>
      {isOpenForm && formAction === "add" ? (
        <BulkUploadAdjuster closeBulkUpload={closeBulkUpload} />
      ) : isOpenForm && formAction === "edit" ? (
        <EditAdjuster
          oldDataAdjuster={editAdjusterData}
          closeEditForm={closeEditAdjuster}
        />
      ) : (
        <AdjusterLists
          adjusterData={db_adjuster_temp}
          openBulkUpload={openBulkUpload}
          openEditForm={openEditAdjuster}
        />
      )}
    </>
  );
};

export default Adjusters;
