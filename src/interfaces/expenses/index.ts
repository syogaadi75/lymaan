import * as yup from "yup";

export const expensesList: {expenses: string; type: string[]}[] = [
  {
    expenses: "Meal",
    type: [],
  },
  {
    expenses: "Transportation",
    type: [
      "Mileage",
      "Taxi",
      "Car Rental",
      "Toll fee",
      "Airplane Ticket",
      "Courer",
    ],
  },
  {
    expenses: "Accomodation",
    type: [],
  },
  {
    expenses: "Insurance Cost",
    type: [],
  },
  {
    expenses: "Survey Allowance",
    type: [],
  },
  {
    expenses: "Forensic Fee",
    type: ["Travel Allowance", "Pulse Allowance"],
  },
];

export type ExpensesMainData = {
  case_id: number;
  expenses: string;
  type: string;
  nominal: string;
  attachment: string;
  is_case: boolean;
};

export interface ExpensesData extends ExpensesMainData {
  id: number;
  created_at: string;
  updated_at: string;
}

export const ExpensesSchema = yup
  .object()
  .shape({
    case_id: yup.number().required().label("Case"),
    expenses: yup.string().required().label("Expenses"),
    type: yup.string().required().label("Type"),
    nominal: yup.string().required().label("Nominal"),
    attachment: yup.string().required().label("Attachment"),
  })
  .required();

export type ExpensesType = yup.InferType<typeof ExpensesSchema>;
export type ExpensesAssertsShape = yup.Asserts<typeof ExpensesSchema>;
