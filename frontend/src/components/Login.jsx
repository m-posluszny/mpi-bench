import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import InputForm from "./InputForm.jsx";
import TitleForm from "./TitleForm.jsx";
import { AuthContext } from "./Auth";
import { useState, useContext } from "react";

export default function Login() {
  let history = useHistory();
  const { login, isLoading } = useContext(AuthContext);
  const [loginFailed, setLoginFailed] = useState(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await login(values);
      history.push("/notes");
    } catch (error) {
      setLoginFailed(error.message);
      throw error;
    }
  };
  return (
    <TitleForm isLoading={isLoading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl">Login</h1>
        <InputForm
          placeholder="username"
          type="username"
          registerObj={register("username", { required: true })}
        />
        <InputForm
          placeholder="password"
          type="password"
          error={errors.password}
          registerObj={register("password", { required: true })}
        />
        <h1 className="text-2xl text-red-500">{loginFailed}</h1>
        <button
          type="submit"
          className="rounded-md bg-blue-500 text-white px-2 py-1 text-lg "
        >
          Submit
        </button>
        <div />
        <Link to="/register" className="rounded-md px-2 py-1 text-lg mt-3">
          to register
        </Link>
      </form>
    </TitleForm>
  );
}
