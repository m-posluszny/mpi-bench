import { BrowserRouter, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import View from "./components/View";
import Register from "./components/Register";
import Login from "./components/Login";
import { Auth } from "./components/Auth";
export default function App() {
  document.documentElement.classList.add("dark");
  return (
    <div className="text-center overflow-hidden">
      <BrowserRouter>
        <Auth>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/">
            <></>
          </Route>
        </Auth>
      </BrowserRouter>
    </div>
  );
}
