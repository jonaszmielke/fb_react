//import { token } from "../login/login";
import { useEffect, useState, useRef } from "react";
import fetchForYouPage from "../../../query/fetchfyp";
import Cookies from 'js-cookie';

import "./fyp.css";

import Header from "../../../components/header";
import Post from "../../../components/post/post";


const ForYouPage = () => {
    const userjwt = Cookies.get('userjwt');

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
            requestForYouPage(postsRef.current);
        }

        const handleScroll = () => {
            if (!depletedRef.current && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                requestForYouPage(postsRef.current);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    async function requestForYouPage(currentPosts) {
            
        const new_posts = await fetchForYouPage(currentPosts, userjwt);
        //console.log(new_posts);

        if (new_posts.allPostsDepleted) {
            console.log('All posts depleted, stopping the ForYouPage useEffect');
            setDepleted(true);
            depletedRef.current = true;
            return;
        }
        //console.log(`Appending new posts ${new_posts.postids}\nPosts to omit: ${currentPosts}`);
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
                        <Post key={`post ${id}`} id={id} />
                    ))}
                </section>
                <section></section>
            </div>
        </div>
    );
};

export default ForYouPage;