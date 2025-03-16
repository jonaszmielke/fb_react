import React, { useRef, useCallback } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import Header from '../../../components/header';

import fetchFriendRequests from '../../../query/fetchfriendrequests';
import handleFriendRequest from '../../../query/acceptfriendrequest';

import './friendrequests.css';

export const handleRequest = async ({ action, friendRequestId, queryClient }) => {
    const userjwt = Cookies.get('userjwt');
    const response = await handleFriendRequest({ action: action, friendRequestId: friendRequestId, jwt: userjwt });
    if (response.ok) {
        console.log(`Friend request ${action}ed`);

        // Function to remove accepted friend request from the list
        queryClient.setQueryData(['friendrequests'], oldData => {
            if (!oldData) return oldData; // Check if oldData is defined
            return {
                ...oldData,
                pages: oldData.pages.map(page => ({
                    ...page,
                    list: page.list.filter(request => request.id !== friendRequestId)
                }))
            };
        });

    } else {
        console.log(`Error, friend request was not ${action}ed`);
    }
};

const FriendRequest = ({ data, forwardRef, queryClient }) => {
    return (
        <div className='friend_request' ref={forwardRef}>
            <div>
                <img src={`http://localhost:3000/app_images/profile_pictures/${data.sender.profilePictureUrl}`} alt="user's profile picture" />
            </div>
            <div>
                <h3 className='user_name'>{data.sender.name} {data.sender.surname}</h3>
                <p className='mutual_friends_count'>{data.mutualFriendsCount} mutual friends</p>
                <button className='accept_friend_request_button' onClick={() => handleRequest({ action: 'accept', friendRequestId: data.id, queryClient })}>Accept</button>
                <button className='reject_friend_request_button' onClick={() => handleRequest({ action: 'reject', friendRequestId: data.id, queryClient })}>Reject</button>
            </div>
        </div>
    );
};

const FriendRequestsPage = () => {
    const userjwt = Cookies.get('userjwt');
    const queryClient = useQueryClient();

    // Query for friend requests infinite scroll
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

    // Observer for fetching more requests when scrolled to the last one
    const observer = useRef();
    const lastRequestRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasNextPage]);

    const friend_requests = data?.pages.flatMap(page => page.list);
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
                                        queryClient={queryClient}
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