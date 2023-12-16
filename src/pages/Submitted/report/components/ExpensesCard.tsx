import {Divider, Tooltip} from "antd";
import InputNumberField from "components/hookform/InputNumberField";
import Button from "components/ui/buttons/Button";
import {useUser} from "hooks/atom/useAtom";
import {useGetCaseCashAdvances, useGetCaseExpenses} from "hooks/query";
import {CaseResponse} from "interfaces";
import {useState} from "react";
import {BiPlus} from "react-icons/bi";
import {Link} from "react-router-dom";
import {formatNumberWithCurrency} from "utils";

const ExpensesCard = ({dataSubmitcase}: {dataSubmitcase: CaseResponse}) => {
  const {user} = useUser();
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [remainingCash, setRemainingCash] = useState(0);

  useGetCaseCashAdvances(dataSubmitcase.id, ({data}) => {
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

  useGetCaseExpenses(dataSubmitcase.id, ({data}) => {
    let sumExpenses = 0;

    data.forEach((cash) => {
      sumExpenses += parseInt(cash.nominal);
    });

    setTotalExpenses(sumExpenses);
  });

  return (
    <div className="w-full mt-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
      <div className="pt-4 pb-5">
        <div className="px-5 flex flex-row justify-between items-center">
          <span className="text-xl">Expenses</span>
        </div>
        <Divider className="mt-4 mb-0" />
        <div className="p-5 items-center">
          <Tooltip title={formatNumberWithCurrency(totalExpenses)}>
            <div>
              <InputNumberField
                className="w-full text-black"
                name="total_expenses"
                label="Total Expenses"
                labelclassName="font-medium"
                value={totalExpenses}
                disabled
              />
            </div>
          </Tooltip>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Tooltip title={formatNumberWithCurrency(totalCash)}>
              <div>
                <InputNumberField
                  className="w-full text-black"
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
                  className="w-full text-black"
                  name="remaining_cash"
                  label="Remaining Cash"
                  labelclassName="font-medium"
                  value={remainingCash}
                  disabled
                />
              </div>
            </Tooltip>
            <div>
              {[
                "Keuangan",
                "Admin",
                "Sekretaris",
                "Direktur",
                "Adjuster",
              ].includes(user?.roles ?? "") && (
                <Link to={"/submitted-case/" + dataSubmitcase.id + "/expenses"}>
                  <Button size="large" icon={<BiPlus />} className="w-full">
                    Expenses
                  </Button>
                </Link>
              )}
            </div>
            <div>
              <Button size="large" color="outline" className="w-full">
                See Expenses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesCard;
