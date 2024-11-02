import React, { useState, useEffect, createContext, useContext } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from 'js-cookie';

import LoginPage from "./login/login";
import Home from "./home/home";
import User from "./user/user";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            cacheTime: Infinity
        }
    }
});

/* Maybe someday
const userJwtContext = createContext();
export const useUserJwt = () => useContext(userJwtContext);

export const UserJwtProvider = ({ children }) => {
    const [userjwt, setUserJtw] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const jwt = Cookies.get('userjwt');
        if (jwt) {
            setUserJtw(jwt);
        } else {
            navigate('/');  // Redirect to login if no JWT is found
        }
    }, [navigate]);

    return (
        <userJwtContext.Provider value={{ userjwt, setUserJtw }}>
            {children}
        </userJwtContext.Provider>
    );
};
*/

const App = () => {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/user/:userid" element={<User />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<LoginPage />} />
                </Routes>
            </QueryClientProvider>
        </BrowserRouter>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
