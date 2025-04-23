import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useQuery } from '@tanstack/react-query';
import fetchUserData from '../../query/user/fetchuserdata';
import styles from './header.module.css';

const Header = ({ selected }) => {
    const user = JSON.parse(Cookies.get('user'));
    const userjwt = Cookies.get('userjwt');

    const { data: userData, isLoading, isError } = useQuery({
        queryKey: ['userData', parseInt(user.id)],
        queryFn: ({ queryKey }) => fetchUserData({ queryKey, userjwt }),
    });

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <form
                    className={styles.searchForm}
                    onSubmit={(e) => {
                        e.preventDefault();
                        navigate(`/home/search?query=${encodeURIComponent(searchQuery)}`);
                    }}
                >
                    <input
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="text"
                        placeholder="Search on fb app"
                    />
                </form>
            </div>
            <nav className={styles.nav}>
                <Link to="/home/fyp" className={styles.navLink}>
                    <img
                        src={`../icons/home${selected === 1 ? '_selected' : ''}.svg`}
                        alt="home"
                        className={styles.navImg}
                    />
                </Link>
                <Link to="/home/friend_requests" className={styles.navLink}>
                    <img
                        src={`../icons/friend_requests${selected === 2 ? '_selected' : ''}.svg`}
                        alt="friend requests"
                        className={styles.navImg}
                    />
                </Link>
            </nav>
            <div className={styles.right}>
                <img
                    className={styles.profilePicture}
                    src={`http://localhost:3000/app_images/profile_pictures/${isLoading || isError ? 'default.jpg' : userData.profile_picture_url
                        }`}
                    alt="your profile"
                    onClick={() => navigate(`/user/${user.id}`)}
                />
            </div>
        </header>
    );
};

export default Header;
