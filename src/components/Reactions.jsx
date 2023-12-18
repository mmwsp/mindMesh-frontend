import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserReaction, createReaction, deleteReaction } from '../store/reactionSlice';
import styles from '../styles/Reactions.module.scss';
import { useNavigate } from 'react-router-dom';

const Reactions = ({ postId, commentId, item }) => {
  const [likes, setLikes] = useState(item.reactions?.likes || 0);
  const [dislikes, setDislikes] = useState(item.reactions?.dislikes || 0);
  const [userReaction, setUserReaction] = useState(null);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(checkUserReaction({ postId, commentId }));
        setUserReaction(response.reactionType);
      } catch (error) {
        console.error('Error fetching user reaction:', error);
      }
    };

    fetchData();
  }, [postId, commentId, dispatch]);

  const handleReaction = async (reactionType) => {

    if (!isAuthenticated) {
      return navigate("/login", {replace: true});
    }

    try {
      if (userReaction === reactionType) {
        await dispatch(deleteReaction({ postId, commentId, reactionType }));
        setUserReaction(null);
        reactionType === 'like' ? setLikes(likes - 1) : setDislikes(dislikes - 1);
      } else {
        await dispatch(createReaction({ postId, commentId, reactionType }));
        setUserReaction(reactionType);
        reactionType === 'like' ? setLikes(likes + 1) : setDislikes(dislikes + 1);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  return (
    <div className={styles.container}>
    <button className={userReaction === 'like' ? styles.liked : ''} onClick={() => handleReaction('like')}>
      <img src="/assets/like.png" alt="Like" />
    </button>
    <span>{likes}</span>
    <button className={userReaction === 'dislike' ? styles.disliked : ''} onClick={() => handleReaction('dislike')}>
      <img src="/assets/dislike.png" alt="Dislike" />
    </button>
    <span>{dislikes}</span>
  </div>
  );
};

export default Reactions;