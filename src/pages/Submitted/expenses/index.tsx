import {useParams} from "react-router";
import {Button, Divider, Tooltip} from "antd";
import {
  useGetCaseCashAdvances,
  useGetCaseExpenses,
  useGetSubmitCase,
} from "hooks/query";
import ListTableCashAdvances from "./components/ListTableCashAdvances";

import {useState} from "react";
import {Breadcrumb} from "components/ui";
import {BiPlus, BiRotateRight} from "react-icons/bi";
import CreateDialogCashAdvances from "./components/CreateDialogCashAdvances";
import {useDisclosure} from "hooks";
import ListTableExpenses from "./components/ListTableExpenses";
import CreateExpensesCard from "pages/CashAdvance/expenses/components/CreateExpensesCard";
import InputNumberField from "components/hookform/InputNumberField";
import {formatNumberWithCurrency} from "utils";
import {useUser} from "hooks/atom/useAtom";

type DetailExpensesParams = {
  id: string;
};

function CaseExpenses() {
  const {user} = useUser();
  const {id} = useParams<DetailExpensesParams>();
  const [totalCash, setTotalCash] = useState(0);
  const [remainingCash, setRemainingCash] = useState(0);

  const [typeCashAdvance, setTypeCashAdvance] = useState<"Request" | "Return">(
    "Request",
  );
  const {isOpen, onClose, onOpen} = useDisclosure();

  const {data: dataSubmitCase} = useGetSubmitCase(id);

  const {
    data: dataExpenses,
    isLoading: isLoadingExpenses,
    refetch: refetchExpenses,
  } = useGetCaseExpenses(id);

  const {
    data: dataCashAdvances,
    isLoading: isLoadingCashAdvances,
    refetch: refetchCashAdvances,
  } = useGetCaseCashAdvances(id, ({data}) => {
    let sumCash = 0;
    let sumRemainingCash = 0;

    data.forEach((cash) => {
      if (cash.type == "Budget") {
        sumCash += parseInt(cash.nominal);
        sumRemainingCash += parseInt(cash.nominal);
      } else if (cash.type == "Return")
        sumRemainingCash -= parseInt(cash.nominal);
    });

    setTotalCash(sumCash);
    setRemainingCash(sumRemainingCash);
  });

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
            title: "Submitted Case",
            href: "/submitted-case",
          },
          {
            title: dataSubmitCase?.company.name,
            href: "/submitted-case/" + id,
          },
          {
            title: "Add Expenses",
          },
        ]}
      />

      {["Adjuster", "Admin"].includes(user?.roles ?? "") && (
        <CreateExpensesCard id={id} refetch={refetchExpenses} />
      )}
      <div className="w-full mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
        <div className="py-4 px-8">
          <span className="text-xl">Cash Advance</span>
        </div>
        <Divider className="mt-0" />
        <div className="py-4 px-8">
          <div className="flex mb-4">
            <div className="w-1/2 flex gap-4">
              <Tooltip title={formatNumberWithCurrency(totalCash)}>
                <div>
                  <InputNumberField
                    fullwidth
                    className="text-black"
                    name="total_cash"
                    label="Total Cash"
                    labelclassName="font-medium"
                    value={totalCash}
                    disabled
                  />
                </div>
              </Tooltip>
              <Tooltip title={formatNumberWithCurrency(remainingCash)}>
                <div>
                  <InputNumberField
                    fullwidth
                    className="text-black"
                    name="remaining_cash"
                    label="Remaining Cash"
                    labelclassName="font-medium"
                    value={remainingCash}
                    disabled
                  />
                </div>
              </Tooltip>
            </div>
            {["Adjuster", "Admin"].includes(user?.roles ?? "") && (
              <div className="w-1/2 flex justify-end gap-2">
                <Button
                  type="default"
                  icon={<BiPlus />}
                  onClick={() => {
                    setTypeCashAdvance("Request");
                    onOpen();
                  }}
                  className="bg-primary-500 text-base h-fit text-white hover:!text-white font-medium px-3 py-2 flex items-center justify-center">
                  Request
                </Button>
                <Button
                  type="default"
                  icon={<BiRotateRight />}
                  onClick={() => {
                    setTypeCashAdvance("Return");
                    onOpen();
                  }}
                  className="bg-primary-500 text-base h-fit text-white hover:!text-white font-medium px-3 py-2 flex items-center justify-center">
                  Return
                </Button>
              </div>
            )}
          </div>
          <ListTableCashAdvances
            data={dataCashAdvances?.data ?? []}
            isLoading={isLoadingCashAdvances}
          />
        </div>
      </div>
      <div className="bg-white py-10 flex flex-col basis-full rounded-lg overflow-hidden">
        <ListTableExpenses
          data={dataExpenses?.data ?? []}
          isLoading={isLoadingExpenses}
        />
      </div>
      <CreateDialogCashAdvances
        caseId={id}
        type={typeCashAdvance}
        isOpen={isOpen}
        toggle={onClose}
        onSuccessCreate={() => {
          refetchCashAdvances();
        }}
      />
    </div>
  );
}

export default CaseExpenses;
