import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import fetchjwt from "./fetchjwt";
import Cookies from 'js-cookie';
import { useQuery } from "@tanstack/react-query";

import fetchUserData from '../../query/user/fetchuserdata'

export let token;

const LoginPage = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return(
        <div className="login-page">
            <section>
                <div>
                    <h1>fb app</h1>
                    <h2>A Facebook like app project written in react and express</h2>
                </div>
            </section>
            <section>
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    const jwt = await fetchjwt(email, password);

                    if(jwt.error){
                        token = undefined;
                        const wrong = document.getElementById("wrong");
                        wrong.style.visibility = 'visible';
                    } else {
                        Cookies.set('userjwt', jwt.token, { sameSite: 'Strict', secure: true });
                        Cookies.set('user', JSON.stringify(jwt.user), { sameSite: 'Strict' });
                        navigate('/home/fyp');
                    }
                }}>
                    <p id="wrong" className="wrong">Wrong credentials</p>
                    <input id="email" type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Your email address"/>
                    <input id="password" type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Password"/>
                    <button type="submit">Log in</button>
                    <hr/>
                    <Link to={"/signup"}>Create new account</Link>
                </form>
            </section>
        </div>
    );
};

export default LoginPage;