//import { token } from "../login/login";
import { useEffect, useState, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import fetchForYouPage from "../../../query/fetchfyp";
import Cookies from 'js-cookie';

import "./fyp.css";

import Header from "../../../components/header";
import Post from "../../../components/post/post";


const ForYouPage = () => {
    const userjwt = Cookies.get('userjwt');
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


    return (
        <div id="main">
            <Header selected={1}/>
            <div className="body_fyp">
                <section></section>
                <section id="posts" className="posts">
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