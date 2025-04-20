//import { token } from "../login/login";
import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery ,useInfiniteQuery } from "@tanstack/react-query";
import fetchForYouPage from "../../../query/fetchfyp";
import Cookies from 'js-cookie';
import fetchUserData from "../../../query/user/fetchuserdata";

import "./fyp.css";

import Header from "../../../components/header";
import Post from "../../../components/post/post";
import MakePostPopup from "./makepost";


const ForYouPage = () => {
    const userjwt = Cookies.get('userjwt');
    const user = JSON.parse(Cookies.get('user'));
    const {
        data : postsData,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['fyp_posts'],
        queryFn: ({ pageParam = 0 }) => 
            fetchForYouPage(pageParam, userjwt),
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined
    });

    //transforming list of pages into a list of postids
    const posts = postsData?.pages?.flatMap(page => page.list) || [];

    //observer to fetch more posts when scrolled to the last one
    const observer = useRef();
    const lastPostRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasNextPage]);


    const { data: userData, isLoading: isUserDataLoading, isError: isUserDataError } = useQuery({
        queryKey: ["userData", parseInt(user.id)],
        queryFn: ({ queryKey }) => {
            return fetchUserData({ queryKey, userjwt });
        }
    });

    const [makePostVisible, setMakePostVisible] = useState(false);

    return (
        <div id="main">
            <Header selected={1}/>
            <div className="body_fyp">
                <section></section>
                <section id="posts" className="posts">

                    <div className="make_post">

                        <img 
                            className="headerProfilePicture"
                            src={`http://localhost:3000/app_images/profile_pictures/${isUserDataLoading || isUserDataError ? 'default.jpg' : userData.profile_picture_url}`} 
                        />
                        <p
                            className="make_post_input"
                            onClick={() => {}}
                        >
                            What are you thinking about, {userData.name}?
                        </p>
                        <MakePostPopup
                            trigger={makePostVisible}
                            setTrigger={setMakePostVisible}
                        />

                    </div>

                    { isLoading ? 'Loading' :
                        isError ? 'Error' : 
                            posts.map((id, index) => {
                            const isLast = index === posts.length - 1;
                            return (
                                <Post 
                                    forwardRef={isLast ? lastPostRef : null} 
                                    key={`post ${id}`} 
                                    id={id} 
                                />
                            )
                        })
                    }
                </section>
                <section></section>
            </div>
        </div>
    );
};

export default ForYouPage;