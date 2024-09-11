import { token } from "../login/login";
import fetchFyp from "../query/fetchfyp";
import "./home.css";

import Header from "../header";
import Post from "../post/post";
import { useEffect, useState, useRef } from "react";


const Home = () => {
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

        if(!depletedRef.current){
            requestfyp(postsRef.current);
        }

        const handleScroll = () => {
            if (!depletedRef.current && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                requestfyp(postsRef.current);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    async function requestfyp(currentPosts) {
            
        const new_posts = await fetchFyp(currentPosts);
        console.log(new_posts);

        if (new_posts.allPostsDepleted) {
            console.log('All posts depleted, stopping the fyp useEffect');
            setDepleted(true);
            depletedRef.current = true;
            return;
        }
        console.log(`Appending new posts ${new_posts.postids}\nPosts to omit: ${currentPosts}`);
        setPosts((prevPosts) => prevPosts.concat(new_posts.postids));
    }

    return (
        <div id="main">
            <Header />
            <div className="body">
                <section>
                    <p>Posts: {posts.join(', ')}</p>
                    <p>Depleted: {depleted ? 'yes' : 'no'}</p>
                </section>
                <section id="posts" className="posts">
                    {posts.map((id) => (
                        <Post key={id} id={id} />
                    ))}
                </section>
                <section></section>
            </div>
        </div>
    );
};

export default Home;