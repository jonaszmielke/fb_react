import React, { Suspense } from 'react';
import Header from '../../../components/header/header';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import Post from '../../../components/post/post';
import styles from './search.module.css';
import { useLocation } from 'react-router-dom';
import fetchUserData from '../../../query/user/fetchuserdata';


const User = ({ id }) => {
    const userjwt = Cookies.get('userjwt');

    const { data: userData } = useQuery({
        queryKey: ['userData', id],
        queryFn: ({ queryKey }) => fetchUserData({ queryKey, userjwt }),
        suspense: true,
    });

    return (
        <div className={styles.user}>
            <img
                src={`http://localhost:3000/app_images/profile_pictures/${userData.profile_picture_url}`}
                alt={`${userData.name} ${userData.surname}`}
            />
            <div className={styles.user_data}>
                <h3>{userData.name} {userData.surname}</h3>
                <p>
                    {userData.friends_ammount} znajomi •{' '}
                    {userData.mutual_friends_ammount} wspólni znajomi
                </p>
            </div>
        </div>
    );
};


function Search() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('query');
    const userjwt = Cookies.get('userjwt');

    const fetchResults = async ([_key, query], token) => {
        const url = `http://localhost:3000/api/search?query=${encodeURIComponent(query)}`;
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.ok ? res.json() : { user_results: [], post_results: [] };
    };

    const { data: searchResults, isLoading, isError } = useQuery({
        queryKey: ['search', searchQuery],
        queryFn: ({ queryKey }) => fetchResults(queryKey, userjwt),
    });

    if (isLoading) return <div id="main"><Header /><div>Loading</div></div>;
    if (isError) return <div id="main"><Header /><div>Error</div></div>;

    return (
        <div id="main">
            <Header />

            <div className={styles.users}>
                {searchResults.user_results.map((userId) => (
                    <Suspense
                        key={userId}
                        fallback={
                            <div className={styles.user}>
                                <img
                                    src="http://localhost:3000/app_images/profile_pictures/default.jpg"
                                    alt="default profile"
                                />
                                <div className={styles.user_data}>
                                    <h3>Loading</h3>
                                    <p>Loading</p>
                                </div>
                            </div>
                        }
                    >
                        <User id={userId} />
                    </Suspense>
                ))}
            </div>

            <div className={styles.posts}>
                {searchResults.post_results.map((postId) => (
                    <Post key={postId} id={postId} />
                ))}
            </div>
        </div>
    );
}

export default Search;
