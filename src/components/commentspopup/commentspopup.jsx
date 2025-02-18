import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import fetchComments from '../../query/fetchcomments';

import '../popup.css';
import './commentspopup.css';

function Comment({ comment_data }) {

    return (
        <div className='comment'>
            <p>{comment_data.text}</p>
        </div>
    );
}

function CommentsPopup({ trigger, setTrigger, postid }) {
    const userjwt = Cookies.get('userjwt');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: [`comments ${postid}`, postid],
        queryFn: ({ pageParam = 0, queryKey}) => 
            fetchComments({ queryKey: queryKey, jwt: userjwt, page: pageParam }),
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const comments = data?.pages.flatMap(page => page.list);

    return (trigger) ? (
  
        <div className='popup'>
            <div className='popup-inner'>
                <div className='close-header'>
                    <button className='closeBtn' onClick={() => setTrigger(false)}>X</button>
                </div>
                <div className='content-section'>
                    <p>Comments {postid}</p>
                    {isError ? "Error loading comments" :
                        isLoading ? <p>Loading...</p> : 
                            comments.map((comment, index) => {
                                return (
                                    <Comment key={comment.id} comment_data={comment} />
                                );
                            })
                    }
                </div>
            </div>
        </div>

    ) : "";
}

export default CommentsPopup