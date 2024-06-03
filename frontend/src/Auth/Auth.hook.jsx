import { createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../Misc/LocalStorage.hook";
import { useState } from "react";
import { post, get, BACKEND_URL } from "../Api/core";
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
        const fn = async () => args === undefined ? await request() : await request(...args);
        const auth_failed = (e) => e.detail === "Unauthorized" || e.status === 401
        try {
            console.log("log")
            return await fn()
        } catch (error) {
            console.log(error)
            if (auth_failed(error)) {
                return axios.post(`${BACKEND_URL}/api/auth/refresh`, {}, { withCredentials: true }).then((response) => {
                    console.log("refresh ok")
                    return fn();
                }).catch((e) => {
                    if (auth_failed(e)) {
                        logout();
                    }
                    throw error;
                });
            } throw error;
        }
    };

    const logout = () => {
        setIsLoading(true);
        setUser(null);
        axios.delete(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true }).catch(() => { }).finally(() => {
            setIsLoading(false)
            navigate("/login", { replace: true });
        });
    };

    const authFetcher = ([path, data = {}]) => withAuth(get, path, data);

    const value = useMemo(
        () => ({
            login,
            register,
            logout,
            withAuth,
            authFetcher,
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