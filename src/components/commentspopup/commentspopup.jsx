import React, { useRef, useCallback, forwardRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import fetchComments from '../../query/post/fetchcomments';
import uploadComment from '../../query/post/uploadcomment';
import deleteComment from '../../query/post/deletecomment';

import styles from './commentspopup.module.css';

const dateOptions = {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

const Comment = forwardRef(({ comment_data, postid }, ref) => {
  const theUser = JSON.parse(Cookies.get('user'));
  const userJwt = Cookies.get('userjwt');
  const queryClient = useQueryClient();
  const [showOptions, setShowOptions] = useState(false);

  let date = new Date(comment_data.createdAt);
  date = date.toLocaleString('en-UK', dateOptions);

  const toggleOptions = () => setShowOptions(!showOptions);
  const handleDelete = async () => {
    const success = await deleteComment({ comment_id: comment_data.id, jwt: userJwt });
    if (success) queryClient.invalidateQueries(['comments', postid]);
    setShowOptions(false);
  };

  return (
    <div className={styles.comment} ref={ref}>
      <img
        src={`http://localhost:3000/app_images/profile_pictures/${comment_data?.owner.profilePictureUrl || 'default.jpg'}`}
        alt="Profile"
        className={styles.commentProfilePic}
      />
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <span className={styles.commentName}>{comment_data.owner.name} {comment_data.owner.surname}</span>
          {comment_data.owner.id === theUser.id && (
            <div className={styles.commentOptions}>
              <button onClick={toggleOptions}>⋯</button>
              {showOptions && (
                <div className={styles.commentOptionsDropdown}>
                  <button onClick={handleDelete}>Delete</button>
                </div>
              )}
            </div>
          )}
          <span className={styles.commentDate}>{date}</span>
        </div>
        <p className={styles.commentText}>{comment_data.text}</p>
      </div>
    </div>
  );
});

function CommentsPopup({ trigger, setTrigger, postid, focused = false, setFocused }) {
  const userJwt = Cookies.get('userjwt');
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['comments', postid],
    queryFn: ({ pageParam = 0, queryKey }) =>
      fetchComments({ queryKey, jwt: userJwt, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
  });

  const commentsList = data?.pages.flatMap(page => page.list) || [];
  const observer = useRef();
  const lastCommentRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasNextPage]);

  const [commentInput, setCommentInput] = useState('');
  const uploadCommentHandler = async () => {
    const success = await uploadComment({ postid, text: commentInput, userjwt: userJwt });
    if (success) {
      queryClient.invalidateQueries(['comments', postid]);
      setCommentInput('');
    }
  };

  if (!trigger) return null;

  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <div className={styles.closeHeader}>
          <button
            className={styles.closeBtn}
            onClick={() => { setTrigger(false); setFocused(false); }}
          >
            ×
          </button>
        </div>
        <div className={styles.commentsSection}>
          {isError ? (
            <p>Error loading comments</p>
          ) : isLoading ? (
            <p>Loading...</p>
          ) : (
            commentsList.map((comment, index) => {
              const isLast = index === commentsList.length - 1;
              return (
                <Comment
                  key={comment.id}
                  ref={isLast ? lastCommentRef : null}
                  comment_data={comment}
                  postid={postid}
                />
              );
            })
          )}
        </div>
        <div className={styles.writeComment}>
          <input
            autoFocus={focused}
            type="text"
            placeholder="Write a comment..."
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
          />
          <button
            className={styles.submitButton}
            onClick={() => { uploadCommentHandler(); setFocused(false); }}
          />
        </div>
      </div>
    </div>
  );
}

export default CommentsPopup;