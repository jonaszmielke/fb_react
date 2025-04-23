import React from 'react'
import Header from '../../../components/header'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import Post from '../../../components/post/post'
import styles from './search.module.css';
import { useLocation } from 'react-router-dom';

function Search() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('query');

    const userjwt = Cookies.get('userjwt');

    const fetchResults = async (queryKey, userjwt) => {
        const searchQuery = queryKey[1];
        const url = `http://localhost:3000/api/search?query=${searchQuery}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userjwt}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            return { user_results: [], post_results: [] }; // Return empty results if response is not ok
        }
    };

    const {
        data: searchResults,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['search', searchQuery],
        queryFn: ({ queryKey }) => fetchResults(queryKey, userjwt), // Pass queryKey as an array
    });

    if (isLoading) {
        return (
            <div id="main">
                <Header />
                <div>Loading</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div id="main">
                <Header />
                <div>Error</div>
            </div>
        );
    }

    return (
        <div id="main">
            <Header />
            <div className={styles.users}>
                {searchResults.user_results.map((user_id) => {
                    return <p key={user_id}>{user_id}</p>;
                })}
            </div>
            <div className={styles.posts}>
                {searchResults.post_results.map((post_id) => {
                    return <Post key={post_id} id={post_id} />;
                })}
            </div>
        </div>
    );
}

export default Search