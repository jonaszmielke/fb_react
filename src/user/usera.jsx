import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react";
import Cookies from 'js-cookie';
import fetchUsersPosts from "../query/fetchusersposts";
import "./user.css";

import Header from "../header";
import Post from "../post/post";


const User = () => {

    const userjwt = Cookies.get('userjwt');
    const { userid } = useParams();

    const [posts, setPosts] = useState([]);
    const postsRef = useRef(posts);

    const [depleted, setDepleted] = useState(false);
    const depletedRef = useRef(depleted);

    useEffect(() => {
        postsRef.current = posts;
    }, [posts]);

    useEffect(() => {
        depletedRef.current = depleted;
    }, [depleted]);

    useEffect(() => {

        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        if(!depletedRef.current){
            requestPosts(postsRef.current);
        }

        const handleScroll = () => {
            if (!depletedRef.current && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                requestPosts(postsRef.current);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    async function requestPosts(currentPosts) {
            
        const new_posts = await fetchUsersPosts(userid, userjwt, currentPosts);
        console.log(`requestPosts new_posts: ${new_posts}`);

        if (new_posts.allPostsDepleted) {
            console.log('All posts depleted, stopping the fyp useEffect');
            setDepleted(true);
            depletedRef.current = true;
            return;
        }
        console.log(`Appending new posts ${new_posts.postids}\nPosts to omit: ${currentPosts}`);
        setPosts((prevPosts) => prevPosts.concat(new_posts.postids));
    }

    return(
        <div id="main">
            <Header/>
            <div className="userHeader">
                <div>
                    <section>
                        tło
                    </section>
                    <section>
                        <div className="profilePicture">
                            <img src="" alt="profile picture"/>
                        </div>
                        <div className="stats">
                            <h1>imie nazwisko</h1>
                            <p>x znajomi • x wspólni znajomi</p>
                        </div>
                        <div className="">
                            znajomi button
                        </div>
                    </section>
                </div>
            </div>
            <div className="userbody">
                <section>
                    <h1>id = {userid}</h1>
                </section>
                <section>
                    <div>
                        informacje
                        zdjecia
                        znajomi
                    </div>
                    <div id="userposts" className="userposts">
                        {posts.map((id) => (
                            <Post key={id} id={id} />
                        ))}
                    </div>               
                </section>
                <section>
                    
                </section>
            </div>
        </div>
    );
}

export default User;