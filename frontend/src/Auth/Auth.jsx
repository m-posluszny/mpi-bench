import { createContext, useState, useEffect } from "react";
import { getToken, deleteToken, registerUser, getUser } from "./Api.jsx";
import { useHistory } from "react-router-dom";
import { useSelected } from "../Job/jobSelect.hook.js";

export const AuthContext = createContext();
export const UserContext = createContext();

export function Auth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userContent, setUserContent] = useState(null);
  const { resetList } = useSelected();
  const history = useHistory();

  const checkAuth = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      DeauthUser();
    } else {
      try {
        const user = await getUser(username);
        AuthUser(user);
      } catch (error) {
        console.log(error);
        DeauthUser();
      }
    }
    setIsLoading(false);
  };

  useEffect(() => checkAuth(), []);

  const AuthUser = (userContent) => {
    setIsAuthenticated(true);
    setUserContent(userContent);
    localStorage.setItem("username", userContent.username);
  };
  const DeauthUser = () => {
    setIsAuthenticated(false);
    setUserContent(null);
    localStorage.removeItem("username");
  };

  const authRequest = async (request, ...args) => {
    try {
      return args === undefined ? await request() : await request(...args);
    } catch (error) {
      if (error.message === "Unauthorized") {
        DeauthUser();
        history.push("/login");
      }
      throw error;
    }
  };
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      await getToken(credentials);
      const user = await getUser(credentials.username);
      AuthUser(user);
      setIsLoading(false);
      return user;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      DeauthUser();
      throw error;
    }
  };

  const signup = async (credentials) => {
    try {
      setIsLoading(true);
      await registerUser(credentials);
      const loginForm = {
        username: credentials.username,
        password: credentials.password,
      };
      const respLogin = await login(loginForm);
      setIsLoading(false);
      return respLogin;
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      throw error;
    }
  };
  const logout = async () => {
    try {
      await deleteToken();
    } catch (error) {
      console.log(error);
      throw error;
    }
    resetList()
    DeauthUser();
    history.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        signup,
        authRequest,
      }}
    >
      <UserContext.Provider
        value={{
          userContent,
        }}
      >
        {children}
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}
