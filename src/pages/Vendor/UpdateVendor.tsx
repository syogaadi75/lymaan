import React from "react";
import {Spin} from "antd";
import {useParams} from "react-router";
import {useGetVendor} from "hooks/query";
import InsuredEntry from "./components/InsuredEntry";

const UpdateVendor = () => {
  const {id} = useParams<{id: string}>();
  const {data, isLoading} = useGetVendor(id);

  return (
    <div>
      {isLoading ? (
        <>
          Loading Data <Spin />
        </>
      ) : (
        <InsuredEntry insuredId={id} insured={data?.data} />
      )}
    </div>
  );
};

export default UpdateVendor;
