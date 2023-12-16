import {useLocation} from "react-router";
import {useEffect, useState} from "react";
import PageTitle from "components/ui/PageTitle";
import BrokerEntry from "./components/BrokerEntry";

const AddBroker = () => {
  const basePath = "/broker/";
  const location = useLocation();
  const [prefixPath, setPrefixPath] = useState<string>("");
  const [isAddBroker, setIsAddBroker] = useState<boolean>(false);

  const breadcrumbs = [
    {
      title: "Dashboards",
      href: "/",
    },
    {
      title: "Brokers",
      href: "/brokers",
    },
    {
      title: "Add Brokers",
    },
  ];

  useEffect(() => {
    if (location.pathname.includes(basePath)) {
      const spliitedUrl = location.pathname.split("/broker/")[1];
      setPrefixPath(spliitedUrl);
    }

    if (prefixPath === "add") {
      setIsAddBroker(true);
    } else {
      setIsAddBroker(false);
    }
  }, [location, prefixPath, isAddBroker]);

  return (
    <>
      <PageTitle pageTitle="Add Broker" pageBreadcrumbs={breadcrumbs} />
      <BrokerEntry isAddBroker={isAddBroker} />
    </>
  );
};

export default AddBroker;
