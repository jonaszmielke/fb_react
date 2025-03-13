import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import fetchFriendRequests from '../../../query/fetchfriendrequests';

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
        queryFn: ({ pageParam = 0}) => 
            fetchFriendRequests({ jwt: userjwt, page: pageParam }),
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined
    });

    return (
        <p>{isLoading ? "" : JSON.stringify(data)}</p>
    )
}

export default FriendRequestsPage