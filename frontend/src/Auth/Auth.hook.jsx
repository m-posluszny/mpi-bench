import { createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../Misc/LocalStorage.hook";
import { useState } from "react";
import { post, remove } from "../Api/core";
import axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const isLoggedIn = !!user;

    useEffect(() => {
        if (!user) {
            logout()
        }
    }, [navigate]);

    const register = (username, password) => {
        setIsLoading(true);
        return post("/api/auth/register", { username, password }).then(() => {
            login(username, password)
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const login = (username, password) => {
        setIsLoading(true);
        return post("/api/auth/login", { username, password }).then(() => {
            setUser({ username, password });
            navigate("/");
        }).finally(() => {
            setIsLoading(false);
        })
    };

    const withAuth = async (request, ...args) => {
        try {
            return args === undefined ? await request() : await request(...args);
        } catch (error) {
            if (error.message === "Unauthorized") {
                logout();
            }
            throw error;
        }
    };

    const logout = () => {
        setIsLoading(true);
        setUser(null);
        axios.delete("/api/auth/logout", {}, { withCredentials: true }).catch(() => { }).finally(() => {
            setIsLoading(false)
            navigate("/login", { replace: true });
        });
    };

    const value = useMemo(
        () => ({
            login,
            register,
            logout,
            withAuth,
            user,
            isLoggedIn,
            isLoading,
        }),
        [user]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};