import lymaasLogo from "public/lymaas.png";
import {BsLayoutTextSidebarReverse, BsMegaphone} from "react-icons/bs";
import {BiBarChartSquare, BiWallet} from "react-icons/bi";
import {
  FiDatabase,
  FiCreditCard,
  FiHome,
  FiLayers,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import {HiOutlineBanknotes} from "react-icons/hi2";
import {LuFilePlus2, LuFileCheck2} from "react-icons/lu";
import {ReactComponent as Building} from "public/icons/building-07.svg";
import {ReactComponent as UserSquare} from "public/icons/user-square.svg";
import {ReactComponent as IntersectSquare} from "public/icons/intersect-square.svg";
import {ReactComponent as BuildingLaw} from "public/icons/building-08.svg";
import {ReactComponent as BriefCase} from "public/icons/briefcase-01.svg";
import {type MenuProps, Menu} from "antd";
import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import cx from "classnames";
import {useAtomValue} from "jotai";
import {userAtom} from "hooks/atom/useAtom";

type MenuItem = Required<MenuProps>["items"][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
};

const adminItems: MenuProps["items"] = [
  getItem("Dashboard", "/", <FiHome size={20} />),
  getItem("User Management", "sub1", <FiUsers size={20} />, [
    getItem("Users", "/users", <FiUser size={20} />),
    getItem("Roles", "/roles", <FiLayers size={20} />),
  ]),
  getItem("Instruction", "/instruction", <BsMegaphone size={20} />),
  getItem("Case", "sub2", <BsLayoutTextSidebarReverse size={20} />, [
    getItem("Submitted Case", "/submitted-case", <LuFilePlus2 size={20} />),
    getItem("Complete Case", "/complete-case", <LuFileCheck2 size={20} />),
  ]),
  getItem("Cash Advance", "/cash-advance", <BiWallet size={20} />),
  getItem("Invoice", "sub3", <FiCreditCard size={20} />, [
    getItem("Statistic", "/statistic", <BiBarChartSquare size={20} />),
    getItem("Invoice", "/payment", <HiOutlineBanknotes size={20} />),
  ]),
  getItem("Database", "sub4", <FiDatabase size={20} />, [
    getItem("Insurer", "/insurer", <Building />),
    // getItem("Adjusters", "/adjusters", <UserSquare />),
    getItem("Brokers", "/brokers", <IntersectSquare />),
    getItem("Insured", "/insured", <BuildingLaw />),
    getItem("Case", "/case", <BriefCase />),
  ]),
];

const direkturItems: MenuProps["items"] = [
  getItem("Dashboard", "/", <FiHome size={20} />),
  getItem("User Management", "sub1", <FiUsers size={20} />, [
    getItem("Users", "/users", <FiUser size={20} />),
    getItem("Roles", "/roles", <FiLayers size={20} />),
  ]),
  getItem("Case", "sub2", <BsLayoutTextSidebarReverse size={20} />, [
    getItem("Submitted Case", "/submitted-case", <LuFilePlus2 size={20} />),
    getItem("Complete Case", "/complete-case", <LuFileCheck2 size={20} />),
  ]),
  getItem("Database", "sub4", <FiDatabase size={20} />, [
    getItem("Insurer", "/insurer", <Building />),
    getItem("Adjusters", "/adjusters", <UserSquare />),
    getItem("Brokers", "/brokers", <IntersectSquare />),
    getItem("Insured", "/insured", <BuildingLaw />),
    getItem("Case", "/case", <BriefCase />),
  ]),
];

const managerItems: MenuProps["items"] = [
  getItem("Dashboard", "/", <FiHome size={20} />),
  getItem("User Management", "sub1", <FiUsers size={20} />, [
    getItem("Users", "/users", <FiUser size={20} />),
    getItem("Roles", "/roles", <FiLayers size={20} />),
  ]),
  getItem("Instruction", "/instruction", <BsMegaphone size={20} />),
  getItem("Payment", "sub3", <FiCreditCard size={20} />, [
    getItem("Statistic", "/statistic", <BiBarChartSquare size={20} />),
    getItem("Payment", "/payment", <HiOutlineBanknotes size={20} />),
  ]),
  getItem("Database", "sub4", <FiDatabase size={20} />, [
    getItem("Insurer", "/insurer", <Building />),
    getItem("Adjusters", "/adjusters", <UserSquare />),
    getItem("Brokers", "/brokers", <IntersectSquare />),
    getItem("Insured", "/insured", <BuildingLaw />),
    getItem("Case", "/case", <BriefCase />),
  ]),
];

const sekretarisItems: MenuProps["items"] = [
  getItem("Dashboard", "/", <FiHome size={20} />),
  getItem("Instruction", "/instruction", <BsMegaphone size={20} />),
  getItem("Case", "sub2", <BsLayoutTextSidebarReverse size={20} />, [
    getItem("Submitted Case", "/submitted-case", <LuFilePlus2 size={20} />),
    getItem("Complete Case", "/complete-case", <LuFileCheck2 size={20} />),
  ]),
  getItem("Payment", "sub3", <FiCreditCard size={20} />, [
    getItem("Statistic", "/statistic", <BiBarChartSquare size={20} />),
    getItem("Payment", "/payment", <HiOutlineBanknotes size={20} />),
  ]),
  getItem("Database", "sub4", <FiDatabase size={20} />, [
    getItem("Insurer", "/insurer", <Building />),
    getItem("Adjusters", "/adjusters", <UserSquare />),
    getItem("Brokers", "/brokers", <IntersectSquare />),
    getItem("Insured", "/insured", <BuildingLaw />),
    getItem("Case", "/case", <BriefCase />),
  ]),
];

const tenagaAhliItems: MenuProps["items"] = [
  getItem("Dashboard", "/", <FiHome size={20} />),
  getItem("Case", "sub2", <BsLayoutTextSidebarReverse size={20} />, [
    getItem("Submitted Case", "/submitted-case", <LuFilePlus2 size={20} />),
    getItem("Complete Case", "/complete-case", <LuFileCheck2 size={20} />),
  ]),
];

const adjusterItems: MenuProps["items"] = [
  getItem("Dashboard", "/", <FiHome size={20} />),
  getItem("Instruction", "/instruction", <BsMegaphone size={20} />),
  getItem("Case", "sub2", <BsLayoutTextSidebarReverse size={20} />, [
    getItem("Submitted Case", "/submitted-case", <LuFilePlus2 size={20} />),
    getItem("Complete Case", "/complete-case", <LuFileCheck2 size={20} />),
  ]),
  getItem("Cash Advance", "/cash-advance", <BiWallet size={20} />),
];

const keuanganItems: MenuProps["items"] = [
  getItem("Dashboard", "/", <FiHome size={20} />),
  getItem("Instruction", "/instruction", <BsMegaphone size={20} />),
  getItem("Cash Advance", "/cash-advance", <BiWallet size={20} />),
  getItem("Invoice", "sub3", <FiCreditCard size={20} />, [
    getItem("Statistic", "/statistic", <BiBarChartSquare size={20} />),
    getItem("Invoices", "/payment", <HiOutlineBanknotes size={20} />),
  ]),
];

const openedSubmenu: {[key: string]: string} = {
  "/users": "sub1",
  "/roles": "sub1",
  "/submitted-case": "sub2",
  "/completed-case": "sub2",
  "/statistic": "sub3",
  "/payment": "sub3",
  "/database": "sub4",
  "/insurer": "sub4",
  "/adjusters": "sub4",
  "/insured": "sub4",
  "/case": "sub4",
};

const SideBar = () => {
  const {location, push} = useHistory();
  const handleMenuClick = (path: string) => push(path);
  const [pathname, setPathname] = useState(
    location.pathname.split("/", 2).join("/"),
  );
  const [openedKeys, setOpenedKeys] = useState([openedSubmenu[pathname]]);

  const [items, setItems] = useState<MenuProps["items"]>([]);

  const user = useAtomValue(userAtom);

  useEffect(() => {
    if (!openedKeys.includes(openedSubmenu[pathname])) {
      setOpenedKeys([...openedKeys, openedSubmenu[pathname]]);
    }
    setPathname(location.pathname.split("/", 2).join("/"));
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      const roles = user.roles.toLowerCase();

      if (roles == "admin") setItems(adminItems);
      if (roles == "direktur") setItems(direkturItems);
      if (roles == "manager") setItems(managerItems);
      if (roles == "sekretaris") setItems(sekretarisItems);
      if (roles == "tenaga ahli") setItems(tenagaAhliItems);
      if (roles == "adjuster") setItems(adjusterItems);
      if (roles == "keuangan") setItems(keuanganItems);
    }
  }, [user]);

  return (
    <nav
      className="flex flex-col flex-[0_0_295px] [&_*]:!transition-none"
      style={{boxShadow: "2px 2px 30px rgba(0, 0, 0, 0.05)"}}>
      <div className="flex justify-center mt-5">
        <img src={lymaasLogo} alt="logo" width={200} height={220} />
      </div>
      <div className="flex justify-center mt-11 px-3">
        <Menu
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={[openedSubmenu[pathname]]}
          selectedKeys={[pathname]}
          openKeys={openedKeys}
          onOpenChange={(keys) => setOpenedKeys(keys)}
          onClick={({key}) => handleMenuClick(key)}
          mode="inline"
          items={items}
          className={cx(
            "!border-0",
            "font-medium",
            "text-primary-200",
            "[&>.ant-menu-item]:!h-12",
            "[&>.ant-menu-submenu>div]:!h-12",
            "[&>.ant-menu-submenu>ul>li]:!h-12",
            "[&>.ant-menu-item-selected]:bg-primary-400",
            "[&>.ant-menu-item-selected]:text-white",
            "[&>.ant-menu-item:not(.ant-menu-item-selected):active]:!bg-primary-400",
            "[&>.ant-menu-item:not(.ant-menu-item-selected):active]:text-white",
            "[&>.ant-menu-item:not(.ant-menu-item-selected):hover]:!bg-primary-400",
            "[&>.ant-menu-item:not(.ant-menu-item-selected):hover]:!bg-opacity-75",
            "[&>.ant-menu-item:not(.ant-menu-item-selected):hover]:!text-white",
            "[&>.ant-menu-submenu>ul]:!bg-white",
            "[&>.ant-menu-submenu-selected>div]:bg-primary-400",
            "[&>.ant-menu-submenu-selected>div]:!text-white",
            "[&>.ant-menu-submenu-selected>ul>.ant-menu-item-selected]:bg-[#F0F7FF]",
            "[&>.ant-menu-submenu-selected>ul>.ant-menu-item-selected]:text-primary-200",
            "[&>.ant-menu-submenu>ul>li:not(.ant-menu-item-selected):hover]:!bg-[#F0F7FF]",
            "[&>.ant-menu-submenu>ul>li:not(.ant-menu-item-selected):hover]:!bg-opacity-75",
            "[&>.ant-menu-submenu>ul>li:not(.ant-menu-item-selected):hover]:!text-primary-200",
            "[&>.ant-menu-submenu:not(.ant-menu-submenu-selected)>div:active]:!bg-primary-400",
            "[&>.ant-menu-submenu:not(.ant-menu-submenu-selected)>div:active]:!text-white",
            "[&>.ant-menu-submenu:not(.ant-menu-submenu-selected)>div:hover]:!bg-primary-400",
            "[&>.ant-menu-submenu:not(.ant-menu-submenu-selected)>div:hover]:!bg-opacity-75",
            "[&>.ant-menu-submenu:not(.ant-menu-submenu-selected)>div:hover]:!text-white",
            "[&>.ant-menu-submenu.ant-menu-submenu-selected>div:hover]:!bg-primary-400",
          )}
        />
      </div>
    </nav>
  );
};

export default SideBar;
