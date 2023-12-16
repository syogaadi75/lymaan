import {Avatar, Badge, Button, Dropdown, MenuProps} from "antd";
import {AiOutlineDown, AiOutlineLogout, AiOutlineUser} from "react-icons/ai";
import {Link} from "react-router-dom";
import jsCookie from "js-cookie";
import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {tokenAtom, useUser} from "hooks/atom/useAtom";
import {
  IoCheckmarkCircleOutline,
  IoMenuOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import cx from "classnames";
import {baseUrl} from "constans/config";
import {
  useGetNotification,
  useSeenAllNotification,
  useSeenNotification,
} from "hooks/query";
import {formatDate} from "utils";

type HeaderProps = {
  toggleSidebar: () => void;
};

const Header = ({toggleSidebar}: HeaderProps) => {
  const [token, setToken] = useAtom(tokenAtom);

  const handleLogout = () => {
    setToken(null);
    jsCookie.remove("auth_token");
    jsCookie.remove("user_id");

    location.href = "/login";
  };

  const {user: profileData, refresh} = useUser();

  useEffect(() => {
    refresh();
  }, [token]);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link className="flex mr-2 items-center" to="/profile">
          <AiOutlineUser className="mr-2" />
          Profile
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <a
          onClick={handleLogout}
          className="flex mr-2 items-center"
          rel="noopener noreferrer">
          <AiOutlineLogout className="mr-2" />
          Logout
        </a>
      ),
    },
  ];

  // Notification Feature
  const [markAllAsRead, setMarkAllAsRead] = useState<boolean>(false);

  const [notificationItems, setNotificationItems] = useState<
    MenuProps["items"]
  >([
    {
      key: "1",
      type: "group",
      label: (
        <div className="flex justify-between">
          <p className="text-black">Notifications</p>
          <p
            className={cx("ml-52 flex items-center cursor-pointer", {
              "text-black": !markAllAsRead,
            })}
            onClick={() => setMarkAllAsRead(true)}>
            Mark all as read <IoCheckmarkCircleOutline className="ml-1" />
          </p>
        </div>
      ),
      children: [],
    },
  ]);

  const {data: notificationData, refetch} = useGetNotification();
  const {mutate: seenNotification} = useSeenNotification(() => refetch());
  const {mutate: seenAll} = useSeenAllNotification(() => refetch());

  useEffect(() => {
    if (notificationData) {
      const notificationItems: MenuProps["items"] = [
        {
          key: "1",
          type: "group",
          label: (
            <div className="flex justify-between">
              <p className="text-black">Notifications</p>
              <p
                className={cx("ml-52 flex items-center cursor-pointer", {
                  "text-black": !markAllAsRead,
                })}
                onClick={() => seenAll()}>
                Mark all as read <IoCheckmarkCircleOutline className="ml-1" />
              </p>
            </div>
          ),
          children: [
            ...notificationData.map((item, index) => ({
              key: `1-${index}`,
              label: (
                <Link
                  to={new URL(item.link).pathname}
                  onClick={() => {
                    seenNotification(item.id);
                  }}>
                  <div className="flex space-x-3 my-2">
                    <Badge dot={!item.has_seen} offset={[-32, 0]} color="blue">
                      <Avatar />
                    </Badge>
                    <div>
                      <div className="min-h-[30px] mb-2">
                        {item.description}
                      </div>
                      <div className="text-gray-400">
                        {formatDate(new Date(item.created_at))}
                      </div>
                    </div>
                  </div>
                </Link>
              ),
            })),
          ],
        },
      ];

      setNotificationItems(notificationItems);
    }
  }, [notificationData]);

  return (
    <header className="border-b-[#EAEAEA] border px-8 py-3 justify-between flex">
      <div>
        <Button icon={<IoMenuOutline size={24} />} onClick={toggleSidebar} />
      </div>
      <div className="flex items-center space-x-6">
        <Dropdown
          menu={{items: notificationItems}}
          placement="bottomRight"
          trigger={["click"]}
          overlayClassName="notification-dropdown"
          className="cursor-pointer">
          <a onClick={(e) => e.preventDefault()}>
            <Badge
              size="default"
              count={
                notificationData?.filter((item) => item.has_seen == false)
                  .length ?? 0
              }>
              <IoNotificationsOutline size={24} />
            </Badge>
          </a>
        </Dropdown>
        <Dropdown
          menu={{items}}
          placement="bottomRight"
          trigger={["click"]}
          rootClassName="pointer">
          <div className="flex space-x-2 items-center cursor-pointer">
            <div className="w-9 h-9 overflow-hidden rounded-full">
              {profileData && (
                <img
                  src={
                    profileData.avatar
                      ? `${baseUrl}/uploads/` + profileData.avatar
                      : `https://ui-avatars.com/api/?name=${profileData.name}`
                  }
                  alt="Person"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <p>{profileData?.name}</p>
            <AiOutlineDown />
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
