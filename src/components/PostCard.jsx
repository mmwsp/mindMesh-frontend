import React, { useEffect, useState } from 'react';
import styles from '../styles/PostCard.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, updatePostStatus } from '../store/postSlice';

const Post = ({ post }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [content, setContent] = useState('');
  const currentUserId = useSelector((state) => state.auth.user?.id || 0);
  const currentUser = useSelector((state) => state.auth?.user || 0);
  const userPosts = useSelector((state) => state.posts.userPosts);
  const rawDate = post.publish_date;
  const formattedDate = new Date(rawDate).toLocaleString();

  useEffect(() => {
 
    const tempElement = document.createElement('div');
    tempElement.innerHTML = post.content;

  
    const textContent = tempElement.textContent || tempElement.innerText;

 
    setContent(textContent);
  }, [post.content]);

  const handleVisitClick = () => {
    navigate(`/posts/${post.id}`);
  };

  const handleOptionsClick = (e) => {
    e.stopPropagation();
    setOptionsVisible(!optionsVisible);  
  };

  const handleDelete = () => {
    dispatch(deletePost(post.id));
    setOptionsVisible(false);  
  };

  const handleChangeStatus = () => {
    const newStatus = post.status === 'active' ? 'inactive' : 'active';
    dispatch(updatePostStatus({ postId: post.id, status: newStatus}));
    setOptionsVisible(false); 
  };

  return (
    <div className={styles.postCard}>
    {post.status === 'inactive' && (
      <p className={styles.inactiveStatus}>Inactive</p>
    )}
      <h3 className={styles.postTitle}>{post.title}</h3>
      <div className={styles.authorSection}>
      {post.author_avatar ? (
              <img src={post.author_avatar} className={styles.authorAvatar} alt="img" />
            ) : (
              <img src="/assets/brain.png" className={styles.authorAvatar} alt="img" />
            
            )} 
        <p> {post.author_name}</p>
      </div>

      <div className={styles.categoriesContainer}>
        {post.categories.map((category, index) => (
          <div key={index} className={styles.categoryBlock}>
            {category}
          </div>
        ))}
      </div>

      <p className={styles.content}>{content}...</p>
      <p className={styles.publishDate}>{formattedDate}</p>

      <div className={styles.reactions}>
          <img className={styles.reactionImg} src="/assets/like.png" alt="Like" />
          <span>{post.reactions.likes}</span>
          <img  className={styles.reactionImg} src="/assets/dislike.png" alt="Dislike" />
          <span>{post.reactions.dislikes}</span>
      </div>

      { (currentUserId === post.author_id || currentUser.role === "admin") && (
        <div className={styles.optionsContainer}>
          <div className={styles.optionsIcon} onClick={handleOptionsClick}>
            ...
          </div>
          {optionsVisible && (
            <div className={styles.optionsMenu}>
              <div onClick={handleDelete}>Delete</div>
              <div onClick={handleChangeStatus}>Change Status</div>
            </div>
          )}
        </div>
      )}

      <button className={styles.visitButton} onClick={handleVisitClick}>
        Visit
      </button>
    </div>
  );
};

export default Post;