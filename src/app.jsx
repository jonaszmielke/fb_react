import React from "react";
import {createRoot} from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from "./login/login";
import Home from "./home/home";

const App = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home/>}/>
                <Route path="/" element={<LoginPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>)

