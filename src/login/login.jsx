import React from "react";
import "./login.css";
import { Link } from "react-router-dom";

const LoginPage = () => {
    return(
        <div className="login-page">
            <section>
                <div>
                    <h1>fb app</h1>
                    <h2>A Facebook like app project written in react and node</h2>
                </div>
            </section>
            <section>
                <form>
                    <input id="email" type="email" placeholder="Your email address"/>
                    <input id="password" type="password" placeholder="Password"/>
                    <button type="submit">Log in</button>
                    <hr/>
                    <Link to={"/signup"}>Create new account</Link>
                </form>
            </section>
        </div>
    );
};

export default LoginPage;