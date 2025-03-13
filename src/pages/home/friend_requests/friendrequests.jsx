import React, { useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import Header from '../../../components/header';

import fetchFriendRequests from '../../../query/fetchfriendrequests';

import './friendrequests.css';

const FriendRequest = ({ data, forwardRef }) => {
    return (
        <div className='friend_request' ref={forwardRef}>
            <div>
                <img src={`http://localhost:3000/app_images/profile_pictures/${data.sender.profilePictureUrl}`} alt="user's profile picture" />
            </div>
            <div>
                <h3 className='user_name'>{data.sender.name} {data.sender.surname}</h3>
                <p className='mutual_friends_count'>{data.mutualFriendsCount} mutual friends</p>
                <button className='accept_friend_request_button'>Accept</button>
                <button className='reject_friend_request_button'>Reject</button>
            </div>
        </div>
    );
};

const FriendRequestsPage = () => {
    const userjwt = Cookies.get('userjwt');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['friendrequests'],
        queryFn: ({ pageParam = 0 }) =>
            fetchFriendRequests({ jwt: userjwt, page: pageParam }),
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const observer = useRef();
    const lastRequestRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                console.log('fetching next page');
                fetchNextPage();
            }
        });
        if (node) {observer.current.observe(node);
            console.log('observing last request');
        }
    }, [isLoading, hasNextPage]);

    const friend_requests = data?.pages.flatMap(page => page.list);
    console.log(data);

    return (
        <div id="main">
            <Header selected={2} />
            <div className="body_friend_requests">
                <section></section>
                <section id="friend_requests" className="friend_requests">
                    {isLoading ? "Loading..." :
                        isError ? "An error occurred" :
                            friend_requests.map((request, index) => {
                                const isLast = index === friend_requests.length - 1;
                                return (
                                    <FriendRequest
                                        forwardRef={isLast ? lastRequestRef : null}
                                        key={`friend_request ${request.id}`}
                                        data={request}
                                    />
                                );
                            })
                    }
                </section>
                <section></section>
            </div>
        </div>
    );
};

export default FriendRequestsPage;