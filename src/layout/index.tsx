import cx from "classnames";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import {getClientSideCookie} from "libs/auth";
import {ReactNode, useState} from "react";
import {useRouter} from "hooks";
import {useNotification} from "hooks/atom/useAtom";

const pageWithoutLayout = ["/login", "/register"];

const LayoutRoot = ({children}: {children: ReactNode}) => {
  const {path: query} = useRouter();
  const {notificationElement: contextHolder} = useNotification();

  const isPageWithoutLayout = pageWithoutLayout.includes(query);
  const getAuthorization = getClientSideCookie().token;

  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  const getSideBar = () => {
    if (!getAuthorization) return null;

    return isPageWithoutLayout || !showSidebar ? null : <SideBar />;
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div
      className={cx({
        "flex min-h-screen": !isPageWithoutLayout,
        "login-wrapper": isPageWithoutLayout,
      })}>
      {getSideBar()}
      <main className="w-screen">
        {isPageWithoutLayout ? null : <Header toggleSidebar={toggleSidebar} />}
        <div
          className={cx({
            "px-8 py-5": !isPageWithoutLayout,
            "relative h-screen flex justify-center items-center":
              isPageWithoutLayout,
          })}>
          {contextHolder}
          {children}
        </div>
      </main>
    </div>
  );
};

export default LayoutRoot;
