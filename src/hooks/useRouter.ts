import {useLocation} from "react-router-dom";

export const useRouter = () => {
  const {pathname} = useLocation();

  return {path: pathname};
};
