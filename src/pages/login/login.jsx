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

    return (
        <div className="login-page">
            <section>
                <div>
                    <h1>fb app</h1>
                    <h2>A Facebook like app project written in react and express</h2>
        
                    <div className="links">
                        <div className="check-repos">
                            <h2>Check the repositories</h2>
                            <svg className="github-icon"><path d="M12 1C5.9225 1 1 5.9225 1 12C1 16.8675 4.14875 20.9787 8.52125 22.4362C9.07125 22.5325 9.2775 22.2025 9.2775 21.9137C9.2775 21.6525 9.26375 20.7862 9.26375 19.865C6.5 20.3737 5.785 19.1912 5.565 18.5725C5.44125 18.2562 4.905 17.28 4.4375 17.0187C4.0525 16.8125 3.5025 16.3037 4.42375 16.29C5.29 16.2762 5.90875 17.0875 6.115 17.4175C7.105 19.0812 8.68625 18.6137 9.31875 18.325C9.415 17.61 9.70375 17.1287 10.02 16.8537C7.5725 16.5787 5.015 15.63 5.015 11.4225C5.015 10.2262 5.44125 9.23625 6.1425 8.46625C6.0325 8.19125 5.6475 7.06375 6.2525 5.55125C6.2525 5.55125 7.17375 5.2625 9.2775 6.67875C10.1575 6.43125 11.0925 6.3075 12.0275 6.3075C12.9625 6.3075 13.8975 6.43125 14.7775 6.67875C16.8813 5.24875 17.8025 5.55125 17.8025 5.55125C18.4075 7.06375 18.0225 8.19125 17.9125 8.46625C18.6138 9.23625 19.04 10.2125 19.04 11.4225C19.04 15.6437 16.4688 16.5787 14.0213 16.8537C14.42 17.1975 14.7638 17.8575 14.7638 18.8887C14.7638 20.36 14.75 21.5425 14.75 21.9137C14.75 22.2025 14.9563 22.5462 15.5063 22.4362C19.8513 20.9787 23 16.8537 23 12C23 5.9225 18.0775 1 12 1Z"></path></svg>
                        </div>

                        <Link to='https://github.com/jonaszmielke/fb_react' className="repo-link react-link">
                            <svg className="react-icon" width="100%" height="100%" viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg" class="uwu-hidden mt-4 mb-3 text-brand dark:text-brand-dark w-24 lg:w-28 self-center text-sm me-0 flex origin-center transition-all ease-in-out"><circle cx="0" cy="0" r="2" fill="currentColor"></circle><g stroke="currentColor" stroke-width="1" fill="none"><ellipse rx="10" ry="4.5"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse></g></svg>
                            <p>frontend</p>
                        </Link>
                        <Link to='https://github.com/jonaszmielke/fb_api' className="repo-link node-link">
                            <span className="node-icon" />
                            <p>backend</p>
                        </Link>
                    </div>
                </div>
            </section>
            <section>
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    const jwt = await fetchjwt(email, password);

                    if (jwt.error) {
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
                    <input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Your email address" />
                    <input id="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
                    <button type="submit">Log in</button>
                    <hr />
                    <Link to={"/signup"}>Create new account</Link>
                </form>
            </section>
        </div>
    );
};

export default LoginPage;