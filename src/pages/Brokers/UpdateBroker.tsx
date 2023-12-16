import {useLocation, useParams} from "react-router";
import BrokerEntry from "./components/BrokerEntry";
import {useEffect, useState} from "react";
import {useGetBroker} from "hooks/query";
import PageTitle from "components/ui/PageTitle";

const UpdateBroker = () => {
  const basePath = "/broker/";
  const regexEditPath = /^edit\/\d+$/;
  const location = useLocation();
  const {id} = useParams<{id: string}>();
  const [prefixPath, setPrefixPath] = useState<string>("");
  const [isUpdateBroker, setIsUpdateBroker] = useState<boolean>(false);
  const {data} = useGetBroker(id);

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
      title: "Edit Brokers",
    },
  ];

  useEffect(() => {
    if (location.pathname.includes(basePath)) {
      const spliitedUrl = location.pathname.split("/broker/")[1];
      setPrefixPath(spliitedUrl);
    }

    if (regexEditPath.test(prefixPath)) {
      setIsUpdateBroker(true);
    }
  }, [location, prefixPath, isUpdateBroker]);

  return (
    <>
      <PageTitle pageTitle="Edit Broker" pageBreadcrumbs={breadcrumbs} />
      <BrokerEntry isUpdateBroker={isUpdateBroker} broker={data?.data} />
    </>
  );
};

export default UpdateBroker;
