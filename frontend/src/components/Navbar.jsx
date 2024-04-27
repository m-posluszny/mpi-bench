import { IoMdArrowDropdownCircle } from "react-icons/io";
import DropdownButton from "./DropdownButton";
import { useLocation, useHistory } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext, UserContext } from "./Auth";
import { NotifyContext } from "./View";

function NavText({ title, path, selected }) {
  const history = useHistory();
  return (
    <h1
      key={path}
      className={
        "font-roboto text-4xl my-auto ml-8 hover:opacity-60 h-12" +
        (selected === path ? " border-green-500 border-b-4" : "")
      }
      onClick={() => history.push(path)}
    >
      {title}
    </h1>
  );
}

export default function Navbar() {
  const history = useHistory();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { userContent } = useContext(UserContext);
  const { count, loadCount } = useContext(NotifyContext);

  const selected = "/" + location.pathname.split("/")[1];

  async function onLogout() {
    try {
      await logout();
    } catch {}
    history.push("/login");
  }

  useEffect(() => {
    loadCount();
  }, []);

  return (
    <div className="flex w-full my-4">
      <NavText title="Notes" path="/notes" selected={selected} />
      <NavText
        title="Notifications"
        path="/notifications"
        selected={selected}
      />
      {count !== 0 && selected !== "/notifications" ? (
        <h1 className="rounded-full bg-red-400 w-7 h-7 ml-3 my-auto p-auto text-center text-md ">
          {count}
        </h1>
      ) : null}

      <DropdownButton
        content={<IoMdArrowDropdownCircle size={38} />}
        className="ml-auto mr-3 my-auto mt-2"
        buttonClassName="hover:text-blue-600"
      >
        <div className="clear absolute translate-x-8 tile bg-gray-200 top-14  right-12 mt-2 w-32 h-auto z-50 p-2">
          <button
            id="logout-btn"
            className="tile bg-white px-7 py-2 text-lg left hover:text-red-500"
            onClick={onLogout}
          >
            {" "}
            Logout
          </button>
        </div>
      </DropdownButton>
      <h1 className=" font-roboto text-4xl my-auto mr-6  ">
        {userContent.name}
      </h1>
    </div>
  );
}
