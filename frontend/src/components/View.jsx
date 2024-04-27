import React from "react";
import Navbar from "./Navbar";
import { createContext, useState, useContext } from "react";
import { getNotificationsCount } from "./Api";
import { AuthContext } from "./Auth";

export const NotifyContext = createContext();

export default function View({ children }) {
  const [count, setCount] = useState(0);
  const { authRequest } = useContext(AuthContext);

  const loadCount = async () => {
    try {
      const nc = await authRequest(getNotificationsCount);
      setCount(nc.count);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NotifyContext.Provider
      value={{
        count,
        loadCount,
      }}
    >
      <Navbar />
      {children}
    </NotifyContext.Provider>
  );
}
