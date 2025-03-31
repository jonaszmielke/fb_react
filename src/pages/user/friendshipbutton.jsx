import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

import handleFriendRequest from "../../query/friend_request/handlefriendrequest";
import sendFriendRequest from "../../query/friend_request/sendfriendrequest";
import fetchUnfriend from "../../query/friend_request/handleUnfriend";

import "../../components/popup.css";

const FriendshipButton = ({ userData, isLoading, queryClient }) => {

    // Friendship status state
    const [status, setStatus] = useState(userData?.friendship_status);
    // Friend request id status
    const [friendRequestId, setFriendRequestId] = useState(null);

    // State for the confirm popup
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    // Keep local state in sync if userData changes externally
    useEffect(() => {
        setStatus(userData?.friendship_status);
    }, [userData]);

    useEffect(() => {
        setFriendRequestId(userData?.friend_request_id);
    }, [isLoading]);

    useEffect(() => {
        setShowConfirmPopup(false);
    }, [status]);

    if (isLoading) return <button className="friendship_button">loading...</button>;

    
    const handleAcceptInvitation = async () => {
        
        const response = await handleFriendRequest({
            action: "accept",
            friendRequestId: friendRequestId,
            jwt: Cookies.get("userjwt")
        });
        if (response.ok) {
            setFriendRequestId(null);
            queryClient.setQueryData(["userData", userData.id], oldData => ({
                ...oldData,
                friendship_status: "friends",
                friend_request_id: null
            }));
            setStatus("friends");

        } else console.log("Error, friend request was not accepted");
    };

    const handleCancelInvitation = async () => {
        
        const response = await handleFriendRequest({
            action: "cancel",
            friendRequestId: friendRequestId,
            jwt: Cookies.get("userjwt")
        });
        if (response.ok) {
            setFriendRequestId(null);
            queryClient.setQueryData(["userData", userData.id], oldData => ({
                ...oldData,
                friendship_status: "not_friends",
                friend_request_id: null
            }));
            setStatus("not_friends");

        } else console.log("Error, friend request was not cancelled");
    }

    const handleUnfriend = async () => {
        const response = await fetchUnfriend({
            friend_id: userData.id,
            jwt: Cookies.get("userjwt")
        });
        if (response.ok) {
            queryClient.setQueryData(["userData", userData.id], oldData => ({
                ...oldData,
                friendship_status: "not_friends"
            }));
            setStatus("not_friends");

        } else console.log("Error, friendship was not deleted");
    }

    const handleAddFriend = async () => {
        const response = await sendFriendRequest({
            receiverid: userData.id,
            jwt: Cookies.get("userjwt")
        });
        if (response.ok) {
            setFriendRequestId(response.friendRequestId);
            queryClient.setQueryData(["userData", userData.id], oldData => ({
                ...oldData,
                friendship_status: "invited_them",
                friend_request_id: response.friendRequestId
            }));
            setStatus("invited_them");

        } else console.log("Error, friend request was not sent");
    };



    const ConfirmPopup = (props) => {
        return (props.trigger) ? (
            <div className="popup">
                <div className="confirm_popup">
                    <p>{props.text}</p>
                    <div className="choice_buttons">
                        <button className="grey" onClick={props.action}>Yes</button>
                        <button className="blue" onClick={() => props.setTrigger(false)}>No</button>
                    </div>
                </div>
            </div>
        ) : "";
    };




    switch (status) {
    case "friends":
        return (
            <>
                <button className="friendship_button grey" onClick={() => setShowConfirmPopup(true)}>
                    <img
                        src="http://localhost:3000/app_images/site/friends.svg"
                        alt="Add Friend"
                        className="add_friend_icon"
                    />
                    Friends
                </button>

                <ConfirmPopup
                    trigger={showConfirmPopup}
                    setTrigger={setShowConfirmPopup}
                    text="Are you sure you want remove this user from your friends?"
                    action={handleUnfriend}
                />
            </>
        );

    case "invited_them":
        return (
            <>
                <button className="friendship_button grey" onClick={() => setShowConfirmPopup(true)}>
                    <img
                        src="http://localhost:3000/app_images/site/cancel_request.svg"
                        alt="Add Friend"
                        className="add_friend_icon"
                    />
                    Cancel invitation
                </button>

                <ConfirmPopup
                    trigger={showConfirmPopup}
                    setTrigger={setShowConfirmPopup}
                    text="Are you sure you want to cancel the friend request?"
                    action={handleCancelInvitation}
                />
            </>
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