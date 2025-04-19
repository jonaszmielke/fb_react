import React, {useRef, useCallback, forwardRef, useState} from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import fetchComments from '../../query/post/fetchcomments';
import uploadComment from '../../query/post/uploadcomment';
import deleteComment from '../../query/post/deletecomment';

import '../popup.css';
import './commentspopup.css';
import { data } from 'react-router-dom';

const date_options = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
};


const Comment = forwardRef(({ comment_data, postid }, ref) => {

    const theuser = JSON.parse(Cookies.get('user'));
    const userjwt = Cookies.get('userjwt');
    const queryClient = useQueryClient();
    const [showOptions, setShowOptions] = useState(false); // State for dropdown visibility

    let date = new Date(comment_data.createdAt);
    date = date.toLocaleString('en-UK', date_options);

    const toggleOptions = () => setShowOptions(!showOptions); // Toggle dropdown visibility
    const handleDelete = async () => {

        const success = await deleteComment({comment_id: comment_data.id, jwt: userjwt})
        if (success) queryClient.invalidateQueries(['comments', postid]);
        
        setShowOptions(false);
    };

    return (
        <span className='comment' ref={ref}>
            <img 
                src={`http://localhost:3000/app_images/profile_pictures/${comment_data?.owner.profilePictureUrl || "default.jpg"}`} 
                alt="Profile"
                className="comment-profile-pic"
            />
            <div className="comment-content">
                <div className='comment-header'>
                    <span className='comment-name'>{comment_data.owner.name} {comment_data.owner.surname}</span>
                    <span className='comment-date'>{date}</span>
                    { comment_data.owner.id == theuser.id && (
                        <>
                            <button onClick={toggleOptions}>...</button>
                            {showOptions && (
                                <div className="comment-options">
                                    <button onClick={handleDelete}>Delete</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <p className='comment-text'>{comment_data.text}</p>
            </div>
        </span>
    );
});



function CommentsPopup({ trigger, setTrigger, postid, focused=false, setFocused }) {

    const userjwt = Cookies.get('userjwt');
    const queryClient = useQueryClient();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['comments', postid],
        queryFn: ({ pageParam = 0, queryKey}) => 
            fetchComments({ queryKey: queryKey, jwt: userjwt, page: pageParam }),
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const comments_list = data?.pages.flatMap(page => page.list);

    const observer = useRef();
    const lastCommentRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasNextPage]);


    //commenting
    const [comment_input, set_comment_input] = useState('');

    const uploadCommentHandler = async () => {

        const success = await uploadComment({ postid, text: comment_input, userjwt });
        if (success) {
        
            queryClient.invalidateQueries(['comments', postid]);
            set_comment_input('');
        }
    }

    return (trigger) ? (
  
        <div className='popup'>
            <div className='popup-inner'>
                <div className='close-header'>
                    <button className='closeBtn' 
                        onClick={() => {
                            setTrigger(false)
                            setFocused(false)
                        }}>X
                    </button>
                </div>
                <div className='content-section comments-section'>
                    {isError ? "Error loading comments" :
                        isLoading ? <p>Loading...</p> : 
                            comments_list.map((comment, index) => {
                                const isLast = index === comments_list.length - 1;
                                return (
                                    <Comment 
                                        key={`comment ${comment.id}`}
                                        postid = {postid}
                                        comment_data={comment}
                                        ref={isLast ? lastCommentRef : null}
                                    />
                                );
                            })
                    }
                </div>
                <div className='write_comment'>
                    <input autoFocus={focused} type='text' placeholder='Write a comment' value={comment_input} onChange={(e) => set_comment_input(e.target.value)}></input>
                    <button id='submit_comment_button' 
                        onClick={() => {
                            uploadCommentHandler()
                            setFocused(false)  
                        }}>
                    </button>
                </div>
            </div>
        </div>

    ) : "";
}

export default CommentsPopup