import {Divider} from "antd";
import React from "react";

const LastEditedCard = () => {
  return (
    <div className="w-full mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
      <div className="pt-4 pb-5">
        <span className="pl-5 text-xl">Last Edited</span>
        <Divider className="mt-4 mb-0" />
      </div>
      <div className="mx-8 pb-8 flex flex-col gap-5"></div>
    </div>
  );
};

export default LastEditedCard;
