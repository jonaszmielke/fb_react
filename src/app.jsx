import React, { useState, useEffect, createContext, useContext } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from 'js-cookie';

import LoginPage from "./pages/login/login";
import SingUpPage from "./pages/signup/singup";
import ForYouPage from "./pages/home/fyp/fyp";
import FriendRequestsPage from "./pages/home/friend_requests/friendrequests";
import User from "./pages/user/user";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            cacheTime: Infinity
        }
    }
});

const App = () => {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/user/:userid" element={<User />} />
                    <Route path="/home/fyp" element={<ForYouPage />} />
                    <Route path="/home/friend_requests" element={<FriendRequestsPage />} />
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/signup" element={<SingUpPage/>} />
                </Routes>
            </QueryClientProvider>
        </BrowserRouter>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
