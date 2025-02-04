import React, { useCallback, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

import './friendspopup.css';
import fetchUserFriendsList from '../query/fetchuserfriendslist';

function Friend({ data, forwardRef }) {
    const localRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    entry.target.classList.toggle("show", entry.isIntersecting);
                });
            },
            { threshold: 0.5 }
        );

        const node = localRef.current;
        if (node) {
            observer.observe(node);
        }

        return () => {
            if (node) {
                observer.unobserve(node);
            }
        };
    }, []);

    return (
        <div 
            className="list-friend" 
            ref={(node) => {
                localRef.current = node;
                if (forwardRef) {
                    // Handle forwarded ref (function or object)
                    if (typeof forwardRef === 'function') {
                        forwardRef(node);
                    } else {
                        forwardRef.current = node;
                    }
                }
            }}
        >
            <img src={data.profilePictureUrl} alt="profilowe"/>
            <div>
                <p>{data.name} {data.surname}</p>
            </div>
            <button>Dodaj znajomego</button>
        </div>
    );
}

function FriendsPopup(props) {
    const userjwt = Cookies.get('userjwt');
    const { userid } = useParams();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['friends', userid],
        queryFn: ({ pageParam = 0 }) => 
            fetchUserFriendsList({ queryKey: ['friends', userid], jwt: userjwt, page: pageParam }),
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined
    });

    const friends_list = data?.pages.flatMap(page => page.list);
    const observer = useRef();
    const lastFriendRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasNextPage]);

    return (props.trigger) ? (
        <div className='friends-popup'>
            <div className='popup-inner'>
                <div className='close-header'>
                    <button className='closeBtn' onClick={() => props.setTrigger(false)}>X</button>
                </div>
                <div className='friends-section'>
                    {isError ? "Error loading friends list" :
                        isLoading ? <p>Loading...</p> : 
                        friends_list.map((friend, index) => {
                            const isLast = index === friends_list.length - 1;
                            return (
                                <Friend 
                                    key={friend.id} 
                                    data={friend} 
                                    forwardRef={isLast ? lastFriendRef : null}
                                />
                            );
                        })
                    }
                </div>
            </div>
        </div>
    ) : "";
}

export default FriendsPopup;