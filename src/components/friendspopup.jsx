import React, { useCallback, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

import './friendspopup.css';

import fetchUserFriendsList from '../query/fetchuserfriendslist';


function Friend({ data }){

    return(
        <div className="list-friend">
            <img src={data.profilePictureUrl} alt="profilowe"/>
            <div>
                <p>{data.name} {data.surname}</p>
            </div>
            <button>Dodaj znajomego</button>
        </div>
    );
};

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

            if (entries[0].isIntersecting && hasNextPage){
                console.log(entries[0]);
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
                            
                        if (friends_list.length === index + 1){
                            return(
                                <div className="list-friend" key={friend.id} ref={lastFriendRef}>
                                    <img src={friend.profilePictureUrl} alt="profilowe"/>
                                    <div>
                                        <p>{friend.name} {friend.surname}</p>
                                    </div>
                                    <button>Dodaj znajomego</button>
                                </div>
                            );
                        } else {
                            return(
                                <div className="list-friend" key={`list-friend ${friend.id}`}>
                                    <img src={friend.profilePictureUrl} alt="profilowe"/>
                                    <div>
                                        <p>{friend.name} {friend.surname}</p>
                                    </div>
                                    <button>Dodaj znajomego</button>
                                </div>
                            );
                        }
                    })
                }

            </div>
        </div>
    </div>
    ) : ""
}

export default FriendsPopup;