import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPosts } from '../store/postSlice';
import Post from './PostCard';
import styles from '../styles/Posts.module.scss';

function UserPosts() {
  const userId = useSelector((state) => state.auth.user.id);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.posts.status);
  const userPosts = useSelector((state) => state.posts.userPosts);

  useEffect(() => {
      dispatch(getUserPosts(userId));
  }, [dispatch, userId, status]);
 
  


  return (
  <div className={styles.mypostsContainer}>
    <h1 className={styles.mypostsh}>My posts</h1>
      <div>
        {userPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      {userPosts.length === 0 && <p>No posts found</p>}
  </div>
  );
}

export default UserPosts;


