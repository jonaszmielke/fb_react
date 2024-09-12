import React from "react";
import {createRoot} from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

const App = () => {
    return(
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/user/:id" element={<User/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/" element={<LoginPage/>}/>
                </Routes>
            </QueryClientProvider>
        </BrowserRouter>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>)

