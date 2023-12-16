import {yupResolver} from "@hookform/resolvers/yup";
import {Divider, message} from "antd";
import {InputField} from "components/hookform";
import {
  useCreateInstruction,
  useGetListRoles,
  useUpdateInstruction,
} from "hooks/query";
import {SubmitHandler, useForm} from "react-hook-form";
import {
  InstructionSchema,
  InstructionData,
  InstructionResponse,
  defaultApiListOptions,
} from "interfaces";
import {Breadcrumb} from "components/ui";
import {useHistory} from "react-router-dom";
import {useEffect} from "react";
import Button from "components/ui/buttons/Button";

type FormInstructionProps = {
  instruction?: InstructionResponse;
};

const FormInstruction = ({instruction}: FormInstructionProps) => {
  const {push} = useHistory();

  const {mutate: createInstruction, isLoading} = useCreateInstruction();
  const {mutate: updateInstruction, isLoading: isLoadingUpdate} =
    useUpdateInstruction(instruction ? instruction.id.toString() : "0");
  const {data: roles} = useGetListRoles(defaultApiListOptions);
  const {register, handleSubmit, formState, setError, setValue} = useForm({
    resolver: yupResolver<InstructionData>(InstructionSchema),
    defaultValues: {
      deadline: "2022-01-31 00:00:00",
      status: "In Progress",
      set_priority: "High",
      ...instruction,
    },
  });

  const onSubmit: SubmitHandler<InstructionData> = (data) => {
    if (instruction) {
      updateInstruction(data, {
        onSuccess: () => {
          message.success("Success Update Instruction");
          push("/instruction");
        },
        onError: (data) => {
          alert(JSON.stringify(data));
        },
      });
    } else {
      createInstruction(data, {
        onSuccess: (data) => {
          if (!data.errors) {
            message.success("Success Create Instruction");
            push("/instruction");
          } else {
            data.data.map(({key, value}: {key: any; value: any}) => {
              setError(key, value[0]);
            });

            alert(JSON.stringify(data));
          }
        },
        onError: (data) => {
          alert(JSON.stringify(data));
        },
      });
    }
  };

  useEffect(() => {
    if (instruction && roles) {
      setValue("assigned_to", instruction.assigned_to);
      setValue("company_name", instruction.company_name);
      setValue("deadline", instruction.deadline);
      setValue("description", instruction.description);
      setValue("instruction", instruction.instruction);
      setValue("set_priority", instruction.set_priority);
      setValue("status", instruction.status);
    }
  }, [instruction, roles]);

  return (
    <>
      <span className="text-2xl font-medium">
        {instruction ? "Edit" : "Add"} Instruction
      </span>
      <Breadcrumb
        separator=">"
        items={[
          {
            title: "Dashboard",
            href: "#",
          },
          {
            title: "Instruction",
            href: "/instruction",
          },
          {
            title: (instruction ? "Edit" : "Add") + " Instruction",
          },
        ]}
      />
      <div className="w-full lg:w-1/2 mt-6 mb-24 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg">
        <div className="pt-5">
          <span className="pl-5 text-xl">
            {instruction ? "Edit" : "Add"} Instruction
          </span>
          <Divider className="pb-4 mb-0 mt-4" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-6 pb-6 flex flex-col gap-3">
          <div className="flex flex-col">
            <fieldset className="flex flex-col space-y-1 mb-2">
              <label className="font-medium text-sm">
                Assign To <span className="text-red-500"> &#42; </span>
              </label>
              <select
                className="border border-solid border-[#d6d6d6] rounded-md py-2 px-2 transition-colors hover:border-[#40a9ff] focus:outline-[#40a9ff] focus:border-[#40a9ff] focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]"
                {...register("assigned_to")}>
                <option value="" selected disabled>
                  Select role
                </option>
                {roles?.data?.map(
                  (role: {
                    id: number;
                    name: string;
                    guard_name: string;
                    created_at: string;
                    updated_at: string;
                  }) => {
                    return (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    );
                  },
                )}
              </select>
              <p className="mt-1 text-left text-[12px] text-red-500 opacity-80">
                {formState.errors?.assigned_to?.message}
              </p>
            </fieldset>
            <InputField
              type="text"
              placeholder="Insurer"
              name="company_name"
              label="Insurer "
              isRequired
              register={register}
              errors={formState.errors}
              labelclassName="font-medium text-sm"
            />
            <InputField
              type="text"
              placeholder="Instruction"
              name="instruction"
              label="Instruction"
              isRequired
              register={register}
              errors={formState.errors}
              labelclassName="font-medium text-sm"
            />
            <InputField
              placeholder="Description"
              name="description"
              label="Description"
              isRequired
              register={register}
              errors={formState.errors}
              labelclassName="font-medium text-sm"
            />
          </div>
          <div className="flex justify-end gap-5">
            <Button
              htmlType="button"
              color="secondary"
              size="large"
              onClick={() => push("/instruction")}>
              Cancel
            </Button>
            <Button
              htmlType="submit"
              type="ghost"
              size="large"
              disabled={isLoading || isLoadingUpdate}
              loading={isLoading || isLoadingUpdate}>
              {isLoading ? "Loading" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormInstruction;
