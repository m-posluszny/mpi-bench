import { Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Auth";

export default function PrivateRoute({ children, ...rest }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() =>
        !isLoading ? (
          isAuthenticated ? (
            children
          ) : (
            <Redirect to="/login" />
          )
        ) : null
      }
    />
  );
}
