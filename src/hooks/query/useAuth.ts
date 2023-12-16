import {AuthLoginType} from "interfaces";
import {useMutation} from "react-query";
import {authAPI} from "services";

export const useLogin = () => {
  return useMutation((json: AuthLoginType) => {
    return authAPI.login({...json});
  });
};
