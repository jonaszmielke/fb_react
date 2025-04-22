import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./post.css";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

import fetchPost from "../../query/post/fetchpost";
import likePost from "../../query/post/likepost";
import deletePost from "../../query/post/deletepost";

import CommentsPopup from "../commentspopup/commentspopup";
import { tr } from "framer-motion/client";

const date_options = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
};

const Post = ({ id, forwardRef }) => {
    const userjwt = Cookies.get('userjwt');
    const theuser = JSON.parse(Cookies.get('user'));
    const queryClient = useQueryClient();

    const { data: postDetails, isLoading } = useQuery({
        queryKey: ["post", id],
        queryFn: ({ queryKey }) => {
            return fetchPost({queryKey, userjwt});
        }
    });

    const [showCommentsPopup, setShowCommentsPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [focused, setFocused] = useState(false)

    const handleDelete = async () => {
        
        const success = await deletePost({post_id: id, jwt: userjwt});

        if (success){

            alert(`Post ${id} deleted`);
            queryClient.invalidateQueries(['fyp_posts']);
            queryClient.invalidateQueries(['user_posts']);
        }
    };

    if (isLoading) {
        return (
            <div className="post">
                <p>Loading...</p>
            </div>
        );
    }

    if (!postDetails) {
        return (
            <div className="post">
                <p>Error loading post {id}</p>
            </div>
        );
    }

    let date = new Date(postDetails.createdAt);
    date = date.toLocaleString('en-UK', date_options);


    const togglePostLike = (postid, isLiked) => async () => {

        const success = await likePost({postid, isLiked, userjwt});
        if (success) {

            queryClient.setQueryData(["post", postid], (oldPost) => {
                if (!oldPost) return oldPost; // in case data isn't there yet
    
                return {
                    ...oldPost,
                    isLikedByUser: !oldPost.isLikedByUser,
                    likeCount: oldPost.isLikedByUser ? oldPost.likeCount - 1 : oldPost.likeCount + 1
                };
            });
        }
    }

    
    return (
        <div ref={forwardRef} className="post">
            <div className="postHeader">
                <div>
                    <Link to={`/user/${postDetails.owner.id}`}>
                        <img src={`http://localhost:3000/app_images/profile_pictures/${postDetails.owner.profilePictureUrl}`} alt="Author's profile picture" />
                    </Link>
                    <Link to={`/user/${postDetails.owner.id}`}>
                        <span>{`${postDetails.owner.name} ${postDetails.owner.surname}`}</span>
                    </Link>
                    <span>{date}</span>
                </div>
                <div>
                    <button 
                        className="post_options_button" 
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        ...
                    </button>
                    { showDropdown && !isLoading ?
                        postDetails.owner.id == theuser.id ?
                            (
                                <div className="dropdown-menu">
                                    <button onClick={handleDelete}>Delete</button>
                                </div>
                            )
                    : '' : ''
                    }
                </div>
            </div>
            <div>
                {postDetails.text}
            </div>
            <img src={`http://localhost:3000/app_images/posts/${postDetails.imageUrl}`} alt="Post picture" />
            <div className="post-footer">
                <div className="stats">
                    <div>
                        <img src="../../icons/like.svg" alt="Ammount of likes" />
                        <p>{postDetails.likeCount}</p>    
                    </div>
                    <p onClick={() => {setShowCommentsPopup(true)}} className="comment_count">{postDetails.commentCount} comments</p>
                </div>
                <div className={`like ${postDetails.isLikedByUser ? 'liked' : ''}`} onClick={togglePostLike(id, postDetails.isLikedByUser)}>

                    {postDetails.isLikedByUser ? (
                        <>
                            <img src="../../icons/liked.svg" alt="Liked" />
                            <p>Liked</p>
                        </>
                    ) : (
                        <>
                            <img src="../../icons/like2.svg" alt="Like" />
                            <p>Like</p>
                        </>
                    )}
                </div>
                <div className="comment-button" onClick={() => {
                    setFocused(true)
                    setShowCommentsPopup(true)
                }}>
                    <img src="../../icons/comment.svg" alt="Comment" />
                    <p>Comment</p>
                </div>
            </div>

            <CommentsPopup 
                trigger={showCommentsPopup}
                setTrigger={setShowCommentsPopup} 
                postid={id}
                focused={focused}
                setFocused={setFocused}
            />

        </div>
    );
};

export default Post;
