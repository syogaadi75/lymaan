import {notification} from "antd";
import {BrokersApiType, UserResponse} from "interfaces";
import {atom, useAtom, useSetAtom} from "jotai";
import {useEffect} from "react";
import {useQuery} from "react-query";
import {authAPI} from "services";

export interface NotificationType {
  notificationType?: "success" | "info" | "warning" | "error";
  notificationTitle: string;
  notificationDescription: string | JSX.Element;
}

type UseBrokersProps = {
  setBrokers: (datas: BrokersApiType[]) => void;
};

type UseNotificationProps = {
  setNotification: (notificationContent: NotificationType) => void;
  notificationElement: JSX.Element;
};

export const tokenAtom = atom<string | null>(null);
export const userAtom = atom<UserResponse | null>(null);
export const brokersAtom = atom<BrokersApiType[]>([]);
export const notificationAtom = atom<NotificationType>({
  notificationType: "" as "success" | "info" | "warning" | "error",
  notificationTitle: "",
  notificationDescription: "",
});

export const useUser = () => {
  const [user, setUser] = useAtom(userAtom);

  const {refetch: refresh} = useQuery(
    ["get-profile"],
    () => authAPI.getProfile(),
    {
      onSuccess: (data) => {
        if (data?.data) {
          setUser(data.data);
        }
      },
    },
  );

  return {user, setUser, refresh};
};

export const useBrokers = (): UseBrokersProps => {
  const setBrokers = useSetAtom(brokersAtom);
  return {setBrokers};
};

export const useNotification = (): UseNotificationProps => {
  const [api, contextHolder] = notification.useNotification();
  const [notificationMsg, setNotification] = useAtom(notificationAtom);

  const updateNotification = (notificationContent: NotificationType) =>
    setNotification(notificationContent);

  const handleShowNotif = (contents: NotificationType) => {
    switch (true) {
      case contents.notificationType === "success":
        return api.success({
          message: contents.notificationTitle,
          description: contents.notificationDescription,
          placement: "top",
        });

      case contents.notificationType === "error":
        return api.error({
          message: contents.notificationTitle,
          description: contents.notificationDescription,
          placement: "top",
        });

      case contents.notificationType === "warning":
        return api.warning({
          message: contents.notificationTitle,
          description: contents.notificationDescription,
          placement: "top",
        });

      case contents.notificationType === "info":
        return api.info({
          message: contents.notificationTitle,
          description: contents.notificationDescription,
          placement: "top",
        });

      default:
        break;
    }
  };

  useEffect(() => {
    if (notificationMsg) {
      handleShowNotif(notificationMsg);
    }
  }, [notificationMsg]);

  return {
    setNotification: updateNotification,
    notificationElement: contextHolder,
  };
};
