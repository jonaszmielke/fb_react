import React from "react";
import { token } from "../login/login";
import "./home.css";

import Header from "../header";
import Post from "../post/post";

const Home = () => {
    return (
        <div id="main">
            <Header/>
            <div className="body">
                <section></section>
                <section id="posts" className="posts">
                    <Post id="1"/>
                </section>
                <section></section>
            </div>
        </div>        
    );
};

export default Home;