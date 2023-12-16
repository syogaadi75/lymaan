import {Button, Input} from "antd";
import {Modal} from "components/ui";
import Table from "components/ui/Table";
import {ReactComponent as FileImportIcon} from "public/icons/file-download-02.svg";
import {CiSearch} from "react-icons/ci";
import {IoClose} from "react-icons/io5";

export const ImportButtons = ({...rest}) => {
  return (
    <Button
      htmlType="button"
      type="default"
      className="flex items-center gap-2 py-1 px-2 bg-primary-100 rounded-lg p-[6px] text-white h-fit "
      {...rest}>
      <FileImportIcon />
      Import
    </Button>
  );
};

export const TableModalImport = ({...rest}) => {
  // );
  return (
    <Modal
      width={800}
      closable={false}
      footer={false}
      onClose={rest.onClose}
      isOpen={rest.isOpen}
      title={
        <div className="flex justify-between items-center">
          {rest.title}
          <div className="flex items-center space-x-2">
            <Input
              onChange={(e) => rest.onChangeSearch(e.target.value ?? "")}
              className="font-normal"
              size="small"
              placeholder="Search"
              style={{width: 250, height: 40}}
              prefix={<CiSearch size={20} color="grey" />}
            />
            <Button
              type="text"
              icon={<IoClose size={24} />}
              onClick={rest.onClose}
            />
          </div>
        </div>
      }>
      <Table
        loading={rest.isLoading}
        title={rest.title}
        dataSource={rest.dataSource}
        columns={rest.columns}
      />
    </Modal>
  );
};
