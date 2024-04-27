import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import InputForm from "./InputForm.jsx";
import TitleForm from "./TitleForm.jsx";
import { useState, useContext } from "react";
import { AuthContext } from "./Auth.jsx";

export default function Register() {
  let history = useHistory();
  const [registerFailed, setRegisterFailed] = useState(null);
  const { signup, isLoading } = useContext(AuthContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await signup(values);
      history.push("/notes");
    } catch (error) {
      setRegisterFailed(error.message);
    }
  };

  return (
    <TitleForm isLoading={isLoading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl">Registration</h1>
        <InputForm
          placeholder="username"
          error={errors.username}
          registerObj={register("username", {
            required: true,
          })}
        />
        <InputForm
          placeholder="name"
          error={errors.name}
          registerObj={register("name", {
            required: true,
          })}
        />
        <InputForm
          placeholder="password"
          type="password"
          error={errors.password}
          registerObj={register("password", {
            required: true,
          })}
        />
        <h1 className="text-2xl text-red-500">{registerFailed}</h1>
        <button
          type="submit"
          className="rounded-md bg-blue-500 text-white px-2 py-1 text-lg "
        >
          Submit
        </button>
        <div />
        <Link to="/login" className="rounded-md px-2 py-1 text-lg mt-3">
          to login
        </Link>
      </form>
    </TitleForm>
  );
}
