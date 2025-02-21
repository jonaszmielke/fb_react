import React, {useRef, useCallback, forwardRef} from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import fetchComments from '../../query/fetchcomments';

import '../popup.css';
import './commentspopup.css';

const Comment = forwardRef(({ comment_data }, ref) => (
    <div className='comment' ref={ref}>
        <p>{comment_data.text}</p>
    </div>
));


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
    console.log(comments_list);

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

    return (trigger) ? (
  
        <div className='popup'>
            <div className='popup-inner'>
                <div className='close-header'>
                    <button className='closeBtn' onClick={() => setTrigger(false)}>X</button>
                </div>
                <div className='content-section, comments-section'>
                    <p>Comments {postid}</p>
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
            </div>
        </div>

    ) : "";
}

export default CommentsPopup