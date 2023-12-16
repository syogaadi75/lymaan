import {useParams} from "react-router";
import {useGetCaseExpenses, useGetSubmitCase} from "hooks/query";
import ListTable from "./components/ListTable";

import {Breadcrumb} from "components/ui";
import CreateExpensesCard from "./components/CreateExpensesCard";

type DetailExpensesParams = {
  id: string;
};

function DetailExpenses() {
  const {id} = useParams<DetailExpensesParams>();

  const {data: dataSubmitCase} = useGetSubmitCase(id);
  const {
    data: dataExpenses,
    isLoading: isLoadingExpenses,
    refetch,
  } = useGetCaseExpenses(id);

  return (
    <div>
      <div className="text-2xl font-medium">Add Expenses</div>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "/",
          },
          {
            title: "Cash Advance",
            href: "/cash-advance",
          },
          {
            title: dataSubmitCase?.company.name,
          },
          {
            title: "Add Expenses",
          },
        ]}
      />
      <CreateExpensesCard id={id} refetch={refetch} />
      <div className="mt-6 bg-white flex flex-col basis-full rounded-lg overflow-hidden">
        <ListTable
          data={dataExpenses?.data ?? []}
          isLoading={isLoadingExpenses}
        />
      </div>
    </div>
  );
}

export default DetailExpenses;
