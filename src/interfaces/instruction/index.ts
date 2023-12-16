import * as yup from "yup";

export type InstructionData = {
  company_name: string;
  instruction: number;
  description: string;
  status: string;
  assigned_to: number;
  deadline: string;
  set_priority: string;
};

export interface InstructionResponse extends InstructionData {
  id: number;
  role: {
    id: number;
    name: string;
    guard_name: string;
  };
  created_at: Date;
  updated_at: Date;
}

export const InstructionSchema = yup
  .object()
  .shape({
    company_name: yup.string().required().label("Company Name"),
    instruction: yup.string().required().label("Instrucntion"),
    description: yup.string().required().label("Description"),
    status: yup.string().required().label("Status"),
    assigned_to: yup.string().required().label("Assign To"),
    deadline: yup.string().required().label("Deadline"),
    set_priority: yup.string().required().label("Priority"),
  })
  .required();
