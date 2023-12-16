import {Modal as AntdModal, ModalProps} from "antd";
import {ReactNode} from "react";

interface IModalProps
  extends Omit<ModalProps, "open" | "onCancel" | "title" | "onOk"> {
  onClose(): void;
  isOpen: boolean;
  title: ReactNode;
}

const Modal: React.FC<IModalProps> = ({
  onClose,
  children,
  isOpen,
  title,
  ...rest
}) => {
  return (
    <AntdModal
      centered
      open={isOpen}
      onOk={onClose}
      onCancel={onClose}
      title={title}
      {...rest}>
      {children}
    </AntdModal>
  );
};

export default Modal;
