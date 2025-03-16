import { Link, useParams } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from 'js-cookie';

import fetchUserData from "../../query/fetchuserdata";
import fetchUsersPosts from "../../query/fetchusersposts";

import "./user.css";

import Header from "../../components/header";
import Post from "../../components/post/post";
import FriendsPopup from "../../components/friendspopup/friendspopup";

//functions for friendship button
import { handleRequest } from "../home/friend_requests/friendrequests";


const FriendshipButton = ({userData, isLoading, queryClient}) => {

    if (isLoading) return <button className="friendship_button">loading...</button>;

    const friendshipStatus = userData.friendship_status;
    switch (friendshipStatus) {
        case "friends":
            return <button className="friendship_button">Friends</button>;

        case "invited_them":
            return <button className="friendship_button">Pending</button>;

        case "they_invited":
            return (
                <button className="friendship_button" onClick={() => handleRequest({ action: 'accept', friendRequestId: userData.friend_request_id, queryClient })}>
                    <img src="http://localhost:3000/app_images/site/add-friend.svg" alt="Add Friend" className="add_friend_icon"/>
                    Accept invitation
                </button>
            );

        case "not_friends":
            return (
                <button className="friendship_button">
                    <img src="http://localhost:3000/app_images/site/add-friend.svg" alt="Add Friend" className="add_friend_icon"/>
                    Add Friend
                </button>
            );
        default:
            return <button className="friendship_button">Error</button>;
    }
}



const User = () => {

    const queryClient = useQueryClient();

    //authentication
    const userjwt = Cookies.get('userjwt');
    const { userid } = useParams();


    //user data
    const { data: userData, isLoading: isUserDataLoading } = useQuery({
        queryKey: ["userData", userid],
        queryFn: ({ queryKey }) => {
            return fetchUserData({queryKey, userjwt});
        }
    });

    console.log(userData);

    //posts
    const {
        data: postsData,
        fetchNextPage,
        hasNextPage,
        isLoading: postsLoading,
        isError: isPostsError
    } = useInfiniteQuery({
        queryKey: ['user_posts', userid],
        queryFn: ({ pageParam = 0 }) => 
            fetchUsersPosts({ queryKey: ['user_posts', userid], jwt: userjwt, page: pageParam }),
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined
    });

    //transforming list of pages into a list of postids
    const userPosts = postsData?.pages.flatMap(page => page.list);

    //observer to fetch more posts when scrolled to the last one
    const observer = useRef();
    const lastPostRef = useCallback(node => {
        if (postsLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [postsLoading, hasNextPage]);


    //friends list popup
    const [showFriendsPopup, setShowFriendsPopup] = useState(false);


    return (
        <div id="main">
            <Header />
            <div className="userHeader">
                <div>
                    <section>tło</section>
                    <section>
                        <div className="profilePicture">
                            {isUserDataLoading?
                            "loading" :
                            <img
                                src={`http://localhost:3000/app_images/profile_pictures/${userData.profile_picture_url || "default.jpg"}`}
                                alt="profile picture"
                            />
                            }
                        </div>
                        <div className="user-stats">
                            <h1>{isUserDataLoading? "loading" : userData.name + " " + userData.surname}</h1>
                            <p>
                                {isUserDataLoading? "loading" : userData.friends_ammount} znajomi • {isUserDataLoading? "loading" : userData.mutual_friends_ammount} wspólni znajomi
                            </p>
                        </div>
                        <div className="user-buttons">
                            <FriendshipButton 
                                userData={userData}
                                isLoading={isUserDataLoading}
                                queryClient={queryClient}
                            />
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
                        <div id="friends" className="friends">
                            <div>
                                <h2>Znajomi</h2>
                                <p onClick={() => setShowFriendsPopup(true)}>Pokaż wszystkich znajomych</p>
                                <p className="friendStats">{isUserDataLoading? "loading" : userData.friends_ammount} (wspólnych: {isUserDataLoading? "loading" : userData.mutual_friends_ammount})</p>
                            </div>
                            <div className="friends-grid">
                                {!isUserDataLoading && userData.friends.length > 0 ? (
                                    userData.friends.slice(0, 9).map((friend) => (
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
                        {
                            isPostsError ? "Error loading posts" :
                            postsLoading ? "" :
                                userPosts.map((id, index) => {
                                    const isLast = index === userPosts.length - 1;
                                    return (<Post 
                                        forwardRef={isLast ? lastPostRef : null} 
                                        key={`post ${id}`} 
                                        id={id} 
                                    />)
                                })
                        }
                    </div>               
                </section>
            </div>

            <FriendsPopup trigger={showFriendsPopup} setTrigger={setShowFriendsPopup} userid={userid}/>

        </div>
    );
}

export default User;
