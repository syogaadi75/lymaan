import {Space} from "antd";
import Breadcrumb from "components/ui/Breadcrumb";

interface PageBreadcrumbType {
  title: string;
  href?: string;
}

const PageTitle = ({
  pageTitle,
  pageBreadcrumbs,
}: {
  pageTitle: string;
  pageBreadcrumbs: PageBreadcrumbType[];
}) => {
  return (
    <Space direction="vertical" size={6}>
      <h1 className="text-xl font-medium">{pageTitle}</h1>
      <Breadcrumb separator=">" items={pageBreadcrumbs} />
    </Space>
  );
};

export default PageTitle;
