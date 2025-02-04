import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from 'js-cookie';

import fetchUsersPosts from "../query/fetchusersposts";
import fetchFriends from "../query/fetchfriends";
import fetchUserData from "../query/fetchuserdata";

import "./user.css";

import Header from "../header";
import Post from "../post/post";
import FriendsPopup from "../components/friendsPopup";

const User = () => {

    //authentication
    const userjwt = Cookies.get('userjwt');
    const { userid } = useParams();

    //posts
    const [userPosts, setUserPosts] = useState([]);
    const [depleted, setDepleted] = useState(false);

    //user data
    const { data: userData, isLoading: isUserDataLoading } = useQuery({
        queryKey: ["userData", userid],
        queryFn: () => fetchUserData({
            queryKey: ["userData", userid],
            includeMutualFriends: true,
            jwt: userjwt
        }),
    });

    const displayMutualFriends = (userData, isUserDataLoading) => {
        if (isUserDataLoading || !userData) {
            return (
                'loading'
            );
        }

        return userData?.mutual_friends || 0;
    };

    const displayUserName = (userData, isUserDataLoading) => {
        if (isUserDataLoading || !userData) {
            return (
                'loading'
            );
        }

        return `${userData.name} ${userData.surname}`
            .split(' ')                // Split the string into words
            .map(word =>               // Capitalize the first letter of each word
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' '); 
    }


    //getting posts
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

    //displaing posts
    useEffect(() => {

        setUserPosts([]);
        setDepleted(false);
    
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        requestPosts([]);
    
        const handleScroll = () => {
            if (!depleted && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                requestPosts([]);
            }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => window.removeEventListener('scroll', handleScroll);
    }, [userid]); 


    //getting friends
    const [friends, setFriends] = useState([]);

    async function requestFriends() {
        try {
            const result = await fetchFriends(userid, userjwt);
            console.log('friends:', result);
            setFriends(result);
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    }

    useEffect(() => {
        requestFriends();
    }, [userid, userjwt]);

    const [showFriendsPopup, setShowFriendsPopup] = useState(false);

    return (
        <div id="main">
            <Header />
            <div className="userHeader">
                <div>
                    <section>tło</section>
                    <section>
                        <div className="profilePicture">
                            <img
                                src={userData?.profilePicture || "default-placeholder.png"}
                                alt="profile picture"
                            />
                        </div>
                        <div className="stats">
                            <h1>{displayUserName(userData, isUserDataLoading)}</h1>
                            <p>
                                {friends.length} znajomi • {displayMutualFriends(userData, isUserDataLoading)} wspólni znajomi
                            </p>
                        </div>
                        <div className="">
                            <button id="add_friend_button" className="add_friend_button">Dodaj znajomego</button>
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
                        <div id="friends" className="friends">
                            <div>
                                <h2>Znajomi</h2>
                                <p onClick={() => setShowFriendsPopup(true)}>Pokaż wszystkich znajomych</p>
                                <p className="friendStats">{friends.length} (wspólnych: {displayMutualFriends(userData, isUserDataLoading)})</p>
                            </div>
                            <div className="friends-grid">
                                {friends.length > 0 ? (
                                    friends.map((friend) => (
                                        <Link
                                            to={`/user/${friend.id}`}
                                            key={friend.id}
                                            className="friend-link"
                                        >
                                            <div className="friend">
                                                <img
                                                    src={`http://localhost:3000/app_images/profile_pictures/${friend.profilePictureUrl}`}
                                                    alt={`${friend.name} ${friend.surname}`}
                                                />
                                                <p>
                                                    {friend.name} {friend.surname}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p>No friends to show</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div id="userposts" className="userposts">
                        {userPosts.map((id) => (
                            <Post key={`post ${id}`} id={id} />
                        ))}
                    </div>               
                </section>
            </div>

            <FriendsPopup trigger={showFriendsPopup} setTrigger={setShowFriendsPopup}/>

        </div>
    );
}

export default User;
