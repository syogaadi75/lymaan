type FormContainerType = {children: React.ReactNode};

const FormContainer = ({children}: FormContainerType) => {
  return (
    <div className="my-6 shadow-[0_0_20px_rgba(0,0,0,0.06)] rounded-lg p-4">
      {children}
    </div>
  );
};

export default FormContainer;
