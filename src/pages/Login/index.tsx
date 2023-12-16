import {Card, Button, Switch, Typography} from "antd";
import {useLogin} from "hooks/query/useAuth";
import {useHistory} from "react-router-dom";
import loginImg from "public/Login.png";
import {InputField} from "components/hookform";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {AuthLoginType, AuthSchema} from "interfaces";
import {useSetAtom} from "jotai";
import {tokenAtom, useUser} from "hooks/atom/useAtom";

const LoginPage = () => {
  const setToken = useSetAtom(tokenAtom);
  const {Title, Paragraph} = Typography;
  const {mutate: login, isLoading} = useLogin();
  const {push} = useHistory();
  const {register, handleSubmit, setError, formState} = useForm({
    resolver: yupResolver(AuthSchema),
  });

  const {refresh} = useUser();

  const onSubmit: SubmitHandler<AuthLoginType> = (submittedData) => {
    login(submittedData, {
      onSuccess: (data) => {
        setToken(data.data?.token);
        if (data.data?.token) {
          push("/");
          refresh();
        } else
          setError("email", {
            type: "invalidCredential",
            message: "Invalid email or password!",
          });
      },
    });
  };

  return (
    <div className="max-w-7xl w-[70vw] aspect-[243/152] max-h-[760px] h-full flex items-center">
      <Card
        className="w-full h-full grid items-center"
        bodyStyle={{padding: 0}}
        style={{
          background:
            "linear-gradient(to left, #1E3957, #3D5774 50%, transparent 50%)",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.06)",
        }}>
        <div className="flex justify-center items-center">
          <div className="w-1/2 flex justify-center items-center px-5">
            <div className="w-9/12 py-10">
              <Title level={2} className="text-center">
                Sign In
              </Title>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="pt-10 flex flex-col gap-5">
                <InputField
                  type="email"
                  placeholder="Enter email address"
                  name="email"
                  label="Email"
                  isRequired
                  register={register}
                  errors={formState.errors}
                  labelclassName="font-medium text-sm"
                />
                <div className="relative">
                  <InputField
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    label="Password"
                    isRequired
                    register={register}
                    errors={formState.errors}
                    labelclassName="font-medium text-sm"
                  />
                  <span className="absolute top-0 right-0 font-light text-sm cursor-pointer">
                    Forgot Password ?
                  </span>
                </div>
                <div className="flex gap-[6px]">
                  <Switch className="bg-white border border-[rgba(0,0,0,0.2)] border-solid !pb-[22px] hover:[&:not(.ant-switch-disabled)]:bg-[#f0f0f0] [&>*:nth-child(1):before]:bg-[rgba(0,0,0,0.2)] [&.ant-switch-checked>:nth-child(1):before]:bg-white" />
                  <span className="text-sm">Remember Me</span>
                </div>
                <Button
                  type="ghost"
                  htmlType="submit"
                  loading={isLoading}
                  className="bg-primary-500 border-0 text-white font-medium text-base h-fit mt-[10px] hover:!text-white hover:bg-primary-600"
                  disabled={isLoading ? true : false}>
                  {isLoading ? "Loading" : "Sign In"}
                </Button>
              </form>
            </div>
          </div>
          <div className="flex flex-col items-center w-1/2 px-5">
            <div className="w-9/12 mb-8">
              <img src={loginImg} alt="logo" width={430} height={400} />
            </div>
            <div className="text-center">
              <Title level={2} className="!text-white">
                Welcome Back!
              </Title>
              <Paragraph className="!text-white w-7/12 mx-auto text-base">
                Enter personal details to your employee account
              </Paragraph>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
