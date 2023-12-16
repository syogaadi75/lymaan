import {useEffect, useState} from "react";
import {atom, useAtom, useSetAtom} from "jotai";

import {Breadcrumb, notification} from "antd";
import TableInsurer from "./TableInsurer";

import {useGetListCompany} from "hooks/query";
import {
  ApiListRequest,
  InsurerMainData,
  defaultApiListOptions,
} from "interfaces";
import {InsurerData} from "interfaces";
import {NotificationType, notificationAtom} from "hooks/atom/useAtom";

interface UseUploadExcel {
  setUploadedExcel: (uploadedExcelFile: File | null) => void;
}

interface UseExtractedInsurers {
  setExtractedInsurers: (extractedInsurers: InsurerData[]) => void;
}

export const uploadedExcelAtom = atom<File | null>(null);
export const extractedInsurersAtom = atom<InsurerMainData[]>([]);

export const useUploadExcel = (): UseUploadExcel => {
  const setUploadedExcel = useSetAtom(uploadedExcelAtom);
  return {setUploadedExcel};
};

export const useExtractedInsurers = (): UseExtractedInsurers => {
  const setExtractedInsurers = useSetAtom(extractedInsurersAtom);
  return {setExtractedInsurers};
};

const ListInsurer = () => {
  const [api, contextHolder] = notification.useNotification();
  const [notifMsg, setNotifMsg] = useAtom(notificationAtom);
  const [uploadedExcel, setUploadedExcel] = useAtom(uploadedExcelAtom);
  const [extractedInsurers, setExtractedInsurers] = useAtom(
    extractedInsurersAtom,
  );
  const [listOption, setListOption] = useState<ApiListRequest>(
    defaultApiListOptions,
  );
  const {data, isLoading, refetch} = useGetListCompany(listOption);
  const insurerBreadcrumb = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Database",
    },
    {
      title: "Insurer",
      href: "/insurer",
    },
  ];

  return (
    <>
      {contextHolder}
      <h1 className="text-2xl">Insurer</h1>
      <Breadcrumb separator=">" items={insurerBreadcrumb} />
      <TableInsurer
        data={data}
        refetch={refetch}
        isDataLoading={isLoading}
        listOption={listOption}
        setListOption={setListOption}
      />
    </>
  );
};

export default ListInsurer;
