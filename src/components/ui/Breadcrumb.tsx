import BreadcrumbAntd, {
  BreadcrumbItemType,
  BreadcrumbProps,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";
import {Link} from "react-router-dom";

const itemRender = (
  route: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>,
) => {
  return route.href ? (
    <Link to={route.href}>{route.title}</Link>
  ) : (
    <span>{route.title}</span>
  );
};

interface IBreadcrumbProps extends Omit<BreadcrumbProps, "items"> {
  items: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[];
}

const Breadcrumb = ({items, ...rest}: IBreadcrumbProps) => (
  <BreadcrumbAntd {...rest} itemRender={itemRender} items={items} />
);

export default Breadcrumb;
