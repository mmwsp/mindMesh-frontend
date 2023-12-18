import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../store/commentsSlice';
import commentFormStyles from '../styles/CommentForm.module.scss';

const CommentForm = ({ postId, replyTo  }) => {
  const dispatch = useDispatch();
  const [commentContent, setCommentContent] = useState('');
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.user?.id || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (commentContent.trim() === '') {
     
      return;
    }

    if (userId === 0) {
      return alert("you must be logged in to perform these actions.");
    }

    try {
        await dispatch(
            createComment({
              postId,
              commentData: {
                content: commentContent,
                authorId: isAuthenticated ? userId : null,
                reply: replyTo,
              },
            })
          );
      setCommentContent('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div className={commentFormStyles.commentForm}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleSubmit} >Submit</button>
      </form>
    </div>
  );
};

export default CommentForm;