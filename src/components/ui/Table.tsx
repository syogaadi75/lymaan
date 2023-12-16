import { DatePicker, Input, PaginationProps, Table as TableAntd } from "antd";
import { ColumnsType } from "antd/es/table";
import { ApiPaginationResponse } from "interfaces";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaFileUpload, FaPlus } from "react-icons/fa";
import { IoPrint, IoReload } from "react-icons/io5";
import { LuDownload } from "react-icons/lu";
import cx from "classnames";
import Button from "./buttons/Button";

export const paginationFromResponse = (
  data: any | undefined,
): ApiPaginationResponse | undefined => {
  if (data == undefined) {
    return undefined;
  }
  return {
    per_page: data.per_page,
    current_page: data.current_page,
    last_page: data.last_page,
    to: data.to,
    total: data.total,
  };
};

export type MainColumnsType = {
  key: React.Key;
  no: number;
};

type TableProps<T> = {
  title: string;
  onImportButton?: () => void;
  onAddButton?: () => void;
  onExportButton?: () => void;
  onPrintButton?: () => void;
  onReloadButton?: () => void;
  onChangeSearch?: (value: string) => void;
  dataSource: T[];
  columns: ColumnsType<T>;
  datePicker?: boolean;
  pagination?: ApiPaginationResponse | null;
  onChangePagination?: (page: number, pageSize: number) => void;
  loading: boolean;
};

const paginationRender: PaginationProps["itemRender"] = (
  _,
  type,
  originalElement,
) => {
  if (type === "prev") {
    return <a>Previous</a>;
  }
  if (type === "next") {
    return <a>Next</a>;
  }
  return originalElement;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Table = <T extends Record<string, any>>({
  title,
  onAddButton,
  onImportButton,
  onExportButton,
  onPrintButton,
  onReloadButton,
  onChangeSearch,
  columns,
  dataSource,
  datePicker,
  pagination,
  onChangePagination,
  loading,
}: TableProps<T>) => {
  useEffect(() => {
    if (
      pagination &&
      pagination.last_page < pagination.current_page &&
      onChangePagination
    ) {
      onChangePagination(pagination.last_page, pagination.per_page);
    }
  }, [pagination]);
  return (
    <div className="my-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
      <div
        className={cx("flex items-center justify-between", {
          "px-7 py-5":
            onAddButton ||
            onExportButton ||
            onPrintButton ||
            onReloadButton ||
            onChangeSearch,
        })}>
        <div id="action" className="flex space-x-2">
          {onAddButton && (
            <Button
              htmlType="button"
              type="default"
              className="bg-primary-300 text-base text-white font-medium px-3 py-5 flex items-center justify-center"
              onClick={onAddButton}>
              <FaPlus className="mr-2" />
              <span>Add {title}</span>
            </Button>
          )}
          {onImportButton && (
            <Button
              htmlType="button"
              type="default"
              className="bg-primary-300 text-base text-white font-medium px-3 py-5 flex items-center justify-center"
              onClick={onImportButton}>
              <FaFileUpload className="mr-2.5" size={19} />
              <span>Import {title}</span>
            </Button>
          )}
          {onExportButton && (
            <Button
              htmlType="button"
              type="default"
              className="bg-primary-300 text-base text-white font-medium px-3 py-5 flex items-center justify-center"
              onClick={onExportButton}>
              <LuDownload className="mr-2" fontSize={22} />
              <span>Export</span>
            </Button>
          )}
          {onPrintButton && (
            <Button
              htmlType="button"
              type="default"
              className="bg-primary-300 text-base text-white font-medium px-3 py-5 flex items-center justify-center"
              onClick={onPrintButton}>
              <IoPrint className="mr-2" fontSize={22} />
              <span>Print</span>
            </Button>
          )}
          {onReloadButton && (
            <Button
              htmlType="button"
              type="default"
              className="bg-primary-300 text-base text-white font-medium px-3 py-5 flex items-center justify-center"
              onClick={onReloadButton}>
              <IoReload className="mr-2" fontSize={22} />
              <span>Reload</span>
            </Button>
          )}
        </div>
        <div className="flex content-center gap-2">
          {datePicker && (
            <DatePicker.RangePicker
              placeholder={["Start", "End"]}
              style={{ width: 240, height: 40 }}
            />
          )}
          {onChangeSearch && (
            <Input
              placeholder="Search"
              style={{ width: 150, height: 40 }}
              prefix={<CiSearch size={20} color="grey" />}
              onChange={(e) => onChangeSearch(e.target.value)}
            />
          )}
        </div>
      </div>
      <div>
        <TableAntd
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: "100%" }}
          rowClassName="[&>*:nth-child(4)]:capitalize"
          loading={loading}
          // pagination={false}
          pagination={
            pagination
              ? {
                className: "px-7 py-5",
                pageSize: pagination.per_page,
                showSizeChanger: true,
                pageSizeOptions: ["15"],
                total: pagination.total,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                current: pagination.current_page,
                itemRender: paginationRender,
                onChange: onChangePagination,
              }
              : false
          }
        />
      </div>
    </div>
  );
};

export default Table;
