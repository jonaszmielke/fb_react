import React, {useRef, useCallback, forwardRef, useState} from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import fetchComments from '../../query/post/fetchcomments';

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


const Comment = forwardRef(({ comment_data }, ref) => {
    let date = new Date(comment_data.createdAt);
    date = date.toLocaleString('en-UK', date_options);

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
                </div>
                <p className='comment-text'>{comment_data.text}</p>
            </div>
        </span>
    );
});



function CommentsPopup({ trigger, setTrigger, postid }) {
    const userjwt = Cookies.get('userjwt');

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

    const [comment_input, set_comment_input] = useState('');

    return (trigger) ? (
  
        <div className='popup'>
            <div className='popup-inner'>
                <div className='close-header'>
                    <button className='closeBtn' onClick={() => setTrigger(false)}>X</button>
                </div>
                <div className='content-section, comments-section'>
                    {isError ? "Error loading comments" :
                        isLoading ? <p>Loading...</p> : 
                            comments_list.map((comment, index) => {
                                const isLast = index === comments_list.length - 1;
                                return (
                                    <Comment 
                                        key={`comment ${comment.id}`} 
                                        comment_data={comment}
                                        ref={isLast ? lastCommentRef : null}
                                    />
                                );
                            })
                    }
                </div>
                <div className='write_comment'>
                    <input type='text' placeholder='Write a comment' value={comment_input} onChange={(e) => set_comment_input(e.target.value)}></input>
                    <button></button>
                </div>
            </div>
        </div>

    ) : "";
}

export default CommentsPopup