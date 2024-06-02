import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/Auth.hook";
import { loadingColors, readyColors } from "../Misc/consts";
import { parseForm } from "../Misc/forms";
import { Title } from "../Static/Title.component";
import { FormRow } from "../Misc/UI.component";

const readyRegisterColors = "bg-orange-700  hover:bg-orange-600"

export const LoginView = () => {
    const { login, register, isLoggedIn } = useAuth();
    const loading = false;


    const handleLogin = async (e) => {
        const obj = parseForm(e);
        const submitter = e.nativeEvent.submitter.name;
        switch (submitter) {
            case "login":
                await login(obj.username, obj.password, true).catch(() => {
                    alert("Invalid username or password");
                });
                break;
            case "register":
                await register(obj.username, obj.password, true).catch(() => {
                    alert("Cannot register user with those credentials");
                });
                break;
            default:
                break;
        }
    }

    if (isLoggedIn) {
        return <Navigate to="/" />
    }

    return (
        <div className="mx-auto h-max">
            <form onSubmit={handleLogin}>
                <div className="mb-10">
                    <Title />
                </div>
                <FormRow>
                    <label
                        className="text-white mx-5"
                        htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="rounded text-black"
                    />
                </FormRow>
                <FormRow>
                    <label
                        className="text-white mx-5 me-6"
                        htmlFor="password">Password </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="rounded text-black"
                    />
                </FormRow>
                <div className="flex">
                    <button className={`${loading ? loadingColors : readyColors} text-white  mx-auto px-5 py-2 m-5 text-lg rounded-xl shadow-md`} name="login" type="submit" value="l">Login</button>
                    <button className={`${loading ? loadingColors : readyRegisterColors} text-white  mx-auto px-5 py-2 m-5 text-lg rounded-xl shadow-md`} name="register" value="r" type="submit">Register</button>
                </div>
            </form>
        </div>
    );
};