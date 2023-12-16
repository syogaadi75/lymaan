import jsCookie from "js-cookie";

export const getClientSideCookie = () => {
  return {
    token: jsCookie.get("auth_token"),
    user_id: jsCookie.get("user_id"),
  };
};
