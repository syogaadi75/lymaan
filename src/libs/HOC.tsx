import {useEffect} from "react";
import {getClientSideCookie} from "./auth";
import {useHistory} from "react-router-dom";

type ArrowFnComponents = () => JSX.Element;

export const withAuth = (Component: ArrowFnComponents) => {
  const AuthenticatedComponent = () => {
    const {token} = getClientSideCookie();
    const {push, location} = useHistory();

    useEffect(() => {
      if (!token) push("/login");
      else if (token && location.pathname === "/login") push("/");
    }, [token, location.pathname]);

    return <Component />;
  };

  return AuthenticatedComponent;
};
