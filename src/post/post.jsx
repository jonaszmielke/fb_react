import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import fetchPost from "../query/fetchpost";
import "./post.css";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

import likePost from "../query/likepost";

import CommentsPopup from "../components/commentspopup/commentspopup";

const date_options = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
};

const Post = ({ id, forwardRef }) => {
    const userjwt = Cookies.get('userjwt');
    const queryClient = useQueryClient();

    const { data: postDetails, isLoading } = useQuery({
        queryKey: ["post", id],
        queryFn: ({ queryKey }) => {
            return fetchPost({queryKey, userjwt});
        }
    });

    const [showCommentsPopup, setShowCommentsPopup] = useState(false);

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
                    <p>...</p>
                </div>
            </div>
            <div>
                {postDetails.text}
            </div>
            <img src={`http://localhost:3000/app_images/posts/${postDetails.imageUrl}`} alt="Post picture" />
            <div className="post-footer">
                <div className="stats">
                    <div>
                        <img src="http://localhost:3000/app_images/site/like.svg" alt="Ammount of likes" />
                        <p>{postDetails.likeCount}</p>    
                    </div>
                    <p>{postDetails.commentCount} comments</p>
                </div>
                <div className={`like ${postDetails.isLikedByUser ? 'liked' : ''}`} onClick={togglePostLike(id, postDetails.isLikedByUser)}>

                    {postDetails.isLikedByUser ? (
                        <>
                            <img src="http://localhost:3000/app_images/site/liked.svg" alt="Liked" />
                            <p>Liked</p>
                        </>
                    ) : (
                        <>
                            <img src="http://localhost:3000/app_images/site/like2.svg" alt="Like" />
                            <p>Like</p>
                        </>
                    )}
                </div>
                <div className="comment" onClick={() => setShowCommentsPopup(true)}>
                    <img src="http://localhost:3000/app_images/site/comment.svg" alt="Comment" />
                    <p>Comment</p>
                </div>
            </div>

            <CommentsPopup trigger={showCommentsPopup} setTrigger={setShowCommentsPopup} postid={id}/>

        </div>
    );
};

export default Post;
