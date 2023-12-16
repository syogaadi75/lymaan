import {Badge, Breadcrumb, Divider, Select, Space} from "antd";
import {Column, Pie, measureTextWidth, Line} from "@ant-design/charts";
import {formatPrice, generateYears} from "utils";
import {useState} from "react";

const Statistic = () => {
  const [showChartType, setShowChartType] = useState("");
  const handleShowChart = (value: string) => {
    setShowChartType(value);
  };

  const breadcrumbItems = [
    {
      title: "Dashboard",
      href: "/",
    },
    {
      title: "Payment",
      href: "/payment",
    },
    {
      title: "Statistic",
    },
  ];

  const data = [
    {
      name: "Income",
      value: 40000000,
      month: "Jan",
    },
    {
      name: "Income",
      value: 50000000,
      month: "Feb",
    },
    {
      name: "Income",
      value: 30000000,
      month: "Mar",
    },
    {
      name: "Income",
      value: 20000000,
      month: "Apr",
    },
    {
      name: "Income",
      value: 19000000,
      month: "May",
    },
    {
      name: "Income",
      value: 57000000,
      month: "Jun",
    },
    {
      name: "Income",
      value: 60000000,
      month: "Jul",
    },
    {
      name: "Income",
      value: 40000000,
      month: "Aug",
    },
    {
      name: "Income",
      value: 26000000,
      month: "Sept",
    },
    {
      name: "Income",
      value: 34000000,
      month: "Oct",
    },
    {
      name: "Income",
      value: 44000000,
      month: "Nov",
    },
    {
      name: "Income",
      value: 14000000,
      month: "Des",
    },
    {
      name: "Outcome",
      value: 20000000,
      month: "Jan",
    },
    {
      name: "Outcome",
      value: 30000000,
      month: "Feb",
    },
    {
      name: "Outcome",
      value: 60000000,
      month: "Mar",
    },
    {
      name: "Outcome",
      value: 40000000,
      month: "Apr",
    },
    {
      name: "Outcome",
      value: 39000000,
      month: "May",
    },
    {
      name: "Outcome",
      value: 47000000,
      month: "Jun",
    },
    {
      name: "Outcome",
      value: 30000000,
      month: "Jul",
    },
    {
      name: "Outcome",
      value: 70000000,
      month: "Aug",
    },
    {
      name: "Outcome",
      value: 86000000,
      month: "Sept",
    },
    {
      name: "Outcome",
      value: 94000000,
      month: "Oct",
    },
    {
      name: "Outcome",
      value: 34000000,
      month: "Nov",
    },
    {
      name: "Outcome",
      value: 24000000,
      month: "Des",
    },
  ];

  const totalIncome = data
    .filter((item) => item.name === "Income")
    .reduce((sum, item) => sum + item.value, 0);

  const totalOutcome = data
    .filter((item) => item.name === "Outcome")
    .reduce((sum, item) => sum + item.value, 0);

  function renderStatistic(
    containerWidth: number,
    text: string,
    style: {fontSize: number},
  ) {
    const {width: textWidth, height: textHeight} = measureTextWidth(
      text,
      style,
    );
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(
            Math.pow(R, 2) /
              (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)),
          ),
        ),
        1,
      );
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:${scale}em;line-height:${
      scale < 1 ? 1 : "inherit"
    };">${text}</div>`;
  }

  const optionChart = [
    {
      value: "disabled",
      label: "Open to select",
      disabled: true,
    },
    {
      value: "bar",
      label: "Bar Chart",
    },
    {
      value: "line",
      label: "Line Chart",
    },
  ];

  const yearsRange = generateYears(1895, 2037).map((year) => {
    return {
      value: year,
      label: year,
    };
  });

  const yearRangeOption = [
    {
      value: "disabled",
      label: "Select to Range",
      disabled: true,
    },
    ...yearsRange,
  ];

  return (
    <>
      <h1 className="text-2xl">Statistic</h1>
      <Breadcrumb separator=">" items={breadcrumbItems} />
      <div className="grid grid-cols-3 gap-5">
        <div className="my-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg col-span-2">
          <div className="flex flex-wrap justify-around pt-10">
            <h1 className="text-2xl font-medium">Financial Analyst</h1>
            <div className="flex gap-5">
              <Space>
                <Badge color="#7A92AD" size="default" />
                <span className="text-xl">Income</span>
              </Space>
              <Space>
                <Badge color="#1E3957" size="default" />
                <span className="text-xl">Outcome</span>
              </Space>
            </div>
            <div className="flex gap-5">
              <Select
                defaultValue="disabled"
                options={optionChart}
                onChange={handleShowChart}
              />
              <Select defaultValue="2023" options={yearRangeOption} />
            </div>
          </div>
          <Divider />
          <div className="p-10">
            {showChartType === "line" ? (
              <Line
                data={data}
                xField="month"
                yField="value"
                seriesField="name"
                color={["#7A92AD", "#1E3957"]}
                yAxis={{
                  label: {
                    formatter: (value) => parseInt(value) / 1000000,
                  },
                }}
                tooltip={{
                  formatter: (item) => {
                    return {
                      name: item.name,
                      value: formatPrice(item.value),
                    };
                  },
                }}
              />
            ) : (
              <Column
                data={data}
                isGroup={true}
                xField="month"
                yField="value"
                dodgePadding={0}
                intervalPadding={10}
                yAxis={{
                  label: {
                    formatter: (value) => parseInt(value) / 1000000,
                  },
                }}
                seriesField="name"
                color={["#7A92AD", "#1E3957"]}
                label={{
                  position: "top",
                  style: {
                    opacity: 0,
                  },
                  layout: [
                    {
                      type: "interval-adjust-position",
                    },
                    {
                      type: "interval-hide-overlap",
                    },
                    {
                      type: "adjust-color",
                    },
                  ],
                }}
                tooltip={{
                  formatter: (item) => {
                    return {
                      name: item.name,
                      value: formatPrice(item.value),
                    };
                  },
                }}
              />
            )}
          </div>
        </div>
        <div className="my-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
          <h1 className="pt-10 px-10 text-2xl font-medium">Balance</h1>
          <Divider />
          <div className="flex justify-center px-10 gap-5">
            <Space>
              <Badge color="#7A92AD" size="default" />
              <span className="text-xl">Income</span>
            </Space>
            <Space>
              <Badge color="#D6D6D6" size="default" />
              <span className="text-xl">Cost</span>
            </Space>
            <Space>
              <Badge color="#1E3957" size="default" />
              <span className="text-xl">Outcome</span>
            </Space>
          </div>
          <div className="p-10">
            <Pie
              appendPadding={10}
              data={data}
              angleField="value"
              colorField="name"
              radius={1}
              innerRadius={0.74}
              color={["#7A92AD", "#1E3957"]}
              label={{
                type: "inner",
                offset: "-50%",
                style: {
                  opacity: 0,
                  textAlign: "bottom",
                },
                autoRotate: false,
                content: (value) => formatPrice(parseInt(value.toString())),
              }}
              statistic={{
                title: {
                  style: {
                    fontSize: "24",
                  },
                  offsetY: -16,
                  customHtml: (container) => {
                    const {width, height} = container.getBoundingClientRect();
                    const d = Math.sqrt(
                      Math.pow(width / 2, 2) + Math.pow(height / 2, 2),
                    );
                    const text = "Total";
                    return renderStatistic(d, text, {
                      fontSize: 32,
                    });
                  },
                },
              }}
              interactions={[
                {
                  type: "element-selected",
                },
                {
                  type: "element-active",
                },
                {
                  type: "pie-statistic-active",
                },
              ]}
            />
            <div className="mt-10 flex flex-wrap justify-between">
              <Space direction="vertical">
                <span className="font-medium text-xl text-primary-100">
                  Income
                </span>
                <span className="font-semibold text-xl">
                  {formatPrice(totalIncome)}
                </span>
              </Space>
              <Space direction="vertical">
                <span className="font-medium text-xl text-primary-100">
                  Outcome
                </span>
                <span className="font-semibold text-xl">
                  {formatPrice(totalOutcome)}
                </span>
              </Space>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistic;
