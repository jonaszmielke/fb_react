import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

import handleFriendRequest from "../../query/handlefriendrequest";
import sendFriendRequest from "../../query/sendfriendrequest";

const FriendshipButton = ({ userData, isLoading, queryClient }) => {

    // Initialize local state with the current friendship status
    const [status, setStatus] = useState(userData?.friendship_status);

    // Keep local state in sync if userData changes externally
    useEffect(() => {
        setStatus(userData?.friendship_status);
    }, [userData]);

    if (isLoading) return <button className="friendship_button">loading...</button>;



    const handleAcceptInvitation = async () => {

        const response = await handleFriendRequest({
            action: "accept",
            friendRequestId: userData.friend_request_id,
            jwt: Cookies.get("userjwt")
        });
        if (response.ok) {
            // Update local state immediately
            setStatus("friends");
            // Also update the cache for consistency
            queryClient.setQueryData(["userData", userData.id], oldData => ({
                ...oldData,
                friendship_status: "friends"
            }));
        } else console.log("Error, friend request was not accepted");
    };


    const handleAddFriend = async () => {

        const response = await sendFriendRequest({
            receiverid: userData.id,
            jwt: Cookies.get("userjwt")
        });
        if (response.ok) {
            setStatus("invited_them");
            queryClient.setQueryData(["userData", userData.id], oldData => ({
                ...oldData,
                friendship_status: "invited_them"
            }));
        } else console.log("Error, friend request was not sent");
    };

    switch (status) {
    case "friends":
        return (
            <button className="friendship_button grey">
                <img
                src="http://localhost:3000/app_images/site/friends.svg"
                alt="Add Friend"
                className="add_friend_icon"
                />
                Add Friend
            </button>
        );

    case "invited_them":
        return (
            <button className="friendship_button grey">
                <img
                src="http://localhost:3000/app_images/site/cancel_request.svg"
                alt="Add Friend"
                className="add_friend_icon"
                />
                Cancel invitation
            </button>
        );

    case "they_invited":
        return (
            <button className="friendship_button blue" onClick={handleAcceptInvitation}>
                <img
                src="http://localhost:3000/app_images/site/add-friend.svg"
                alt="Add Friend"
                className="add_friend_icon"
                />
                Accept invitation
            </button>
        );

    case "not_friends":
        return (
            <button className="friendship_button blue" onClick={handleAddFriend}>
                <img
                src="http://localhost:3000/app_images/site/add-friend.svg"
                alt="Add Friend"
                className="add_friend_icon"
                />
                Add Friend
            </button>
        );

    default:
        return <button className="friendship_button grey">Error</button>;
    }
};

export default FriendshipButton;