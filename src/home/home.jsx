import { token } from "../login/login";
import fetchFyp from "../query/fetchfyp";
import "./home.css";

import Header from "../header";
import Post from "../post/post";
import { useEffect, useState } from "react";


const Home = () => {

    const [posts, setPosts] = useState([]);

    useEffect((posts) => {
        requestfyp(posts);
    }, []);

    async function requestfyp(posts) {
        const new_posts = await fetchFyp(posts);
        if(new_posts)
            setPosts((prevPosts) => prevPosts.concat(new_posts));
    }

    return (
        <div id="main">
            <Header/>
            <div className="body">
                <section></section>
                <section id="posts" className="posts">
                    {posts.map((id) => {
                        return(
                            <Post key={id} id={id}/>
                        )
                    })}
                </section>
                <section></section>
            </div>
        </div>        
    );
};

export default Home;