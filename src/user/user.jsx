import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import fetchUsersPosts from "../query/fetchusersposts";
import fetchFriends from "../query/fetchfriends";
import "./user.css";

import Header from "../header";
import Post from "../post/post";

const User = () => {

    const userjwt = Cookies.get('userjwt');
    const { userid } = useParams();

    //posts
    const [userPosts, setUserPosts] = useState([]);
    const [depleted, setDepleted] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        if (!depleted) {
            requestPosts(userPosts);
        }

        const handleScroll = () => {
            if (!depleted && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                requestPosts(userPosts);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Clean up scroll event listener
        return () => window.removeEventListener('scroll', handleScroll);
    }, [userPosts, depleted, userid]);

    async function requestPosts(currentPosts) {
        try {
            const new_posts = await fetchUsersPosts(userid, userjwt, currentPosts);
            console.log("requestPosts new_posts:", new_posts);

            if (new_posts.allPostsDepleted) {
                console.log('All posts depleted');
                setDepleted(true);
                return;
            }

            setUserPosts((prevPosts) => [...prevPosts, ...new_posts.postids]);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }


    //friends
    const [friends, setFriends] = useState([]);

    async function requestFriends() {
        try{
            const result = await fetchFriends(userid, userjwt);
            console.log('friends:', result);
            setFriends(result);
        } catch (error){
            console.error("Error fetching friends:", error);
        }
    }

    useEffect(() => {
        requestFriends();
    }, []);


    return (
        <div id="main">
            <Header />
            <div className="userHeader">
                <div>
                    <section>tło</section>
                    <section>
                        <div className="profilePicture">
                            <img src="" alt="profile picture" />
                        </div>
                        <div className="stats">
                            <h1>imie nazwisko</h1>
                            <p>{friends.length} znajomi • x wspólni znajomi</p>
                        </div>
                        <div className="">znajomi button</div>
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
                        <div id="friends" className="friends">
                            <div>
                                <h2>Znajomi</h2>
                                <p>Pokaż wszystkich znajomych</p>
                                <p className="friendStats">{friends.length} (wspólnych: x)</p>
                            </div>
                            <div>
                                {friends.length > 0 ? friends.map((friend) => (
                                    <div key={friend.id} className="friend">
                                        <img 
                                            src={`http://localhost:3000/app_images/profile_pictures/${friend.profilePictureUrl}`} 
                                            alt="friend profile picture" 
                                        />
                                        <p>{friend.name} {friend.surname}</p>
                                    </div>
                                )) : <p>No friends to show</p>}
                            </div>
                        </div>
                    </div>
                    <div id="userposts" className="userposts">
                        {userPosts.map((id) => (
                            <Post key={id} id={id} />
                        ))}
                    </div>               
                </section>
            </div>
        </div>
    );
}

export default User;
