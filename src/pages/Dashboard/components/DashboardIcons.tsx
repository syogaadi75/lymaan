import {ReactComponent as Users} from "public/icons/users-solid-icon.svg";
import {ReactComponent as Role} from "public/icons/cluster-role-icon.svg";
import {ReactComponent as Folder} from "public/icons/folder-icon.svg";
import {ReactComponent as CreditCard} from "public/icons/credit-card-refresh-icon.svg";

export const UsersIcon = () => {
  return (
    <Users className="mx-auto w-1/2 h-full absolute right-5 top-5 sm:w-fit sm:h-1/2 md:w-1/2 lg:w-fit lg:h-[50%]" />
  );
};

export const RoleIcon = () => {
  return (
    <Role className="mx-auto w-1/2 h-full absolute right-5 top-5 sm:w-fit sm:h-1/2 md:w-1/2 lg:w-fit lg:h-[50%]" />
  );
};

export const FolderIcon = () => {
  return (
    <Folder className="mx-auto w-1/2 h-full absolute right-5 top-5 sm:w-fit sm:h-1/2 md:w-1/2 lg:w-fit lg:h-[50%]" />
  );
};

export const CreditCardIcon = () => {
  return (
    <CreditCard className="mx-auto w-1/2 h-full absolute right-5 top-5 sm:w-fit sm:h-1/2 md:w-1/2 lg:w-fit lg:h-[50%]" />
  );
};
