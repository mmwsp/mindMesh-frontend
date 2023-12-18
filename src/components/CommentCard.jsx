import React, { useState } from 'react';
import styles from '../styles/CommentCard.module.scss';
import CommentForm from './CommentForm';
import Reactions from './Reactions';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, updateComment } from '../store/commentsSlice';

const CommentCard = ({ comment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const currentUserId = useSelector((state) => state.auth.user?.id || 0);
  const currentUser = useSelector((state) => state.auth?.user || 0);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const dispatch = useDispatch();
  const commentsState = useSelector((state) => state.comments);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const rawDate = comment.publish_date;
  const formattedDate = new Date(rawDate).toLocaleString();


  const handleReplyClick = () => {
    setIsReplying(!isReplying);
  };

  const handleOptionsClick = (e) => {
    e.stopPropagation();
    setOptionsVisible(!optionsVisible);  
  };

  const handleDelete = () => {
    dispatch(deleteComment(comment.id));
    setOptionsVisible(false);  
  };

  const handleEdit = () => {
    setOptionsVisible(false);
    setEditing(true);
  };

  const handleSaveEdit = () => {
    dispatch(updateComment({ commentId: comment.id, newContent: editedContent }));
    setEditing(false);
  };



  const cardClassName = comment.reply ? styles.repliesContainer : styles.commentCard;

  return (
    <div className={cardClassName}>
      <div className={styles.commentAuthor}>
        {comment.author_avatar ? (
            <img src={comment.author_avatar} className={styles.commentAuthorAvatar} alt="img" />
          ) : (
            <img src="/assets/brain.png" className={styles.commentAuthorAvatar} alt="img" />                
          )} 
        <p>{comment.author_name}</p>
      </div>
      {editing ? (
        <textarea
          className={styles.editCommentContent}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <p className={styles.commentContent}>{comment.content}</p>
      )}

      <div className={styles.commentDate}> 
      {formattedDate}
      </div>

      {editing && (
        <div className={styles.editCommentActions}>
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      )}

      <div className={styles.commentActions}>
          <div className={styles.commentReactions}>
            <Reactions postId={null} commentId={comment.id} item={comment}/>
          </div>

      
            <button className={styles.reply} onClick={handleReplyClick}>Reply</button>
      </div>

      {( currentUserId === comment.author_id || currentUser.role === "admin") && (
        <div className={styles.optionsContainer}>
          <div className={styles.optionsIcon} onClick={handleOptionsClick}>
            ...
          </div>
          {optionsVisible && (
            <div className={styles.optionsMenu}>
              <div onClick={handleDelete}>Delete</div>
              <div onClick={handleEdit}>Edit</div>
            </div>
          )}
        </div>
      )}
      {isReplying && (
      <div className={styles.replyForm}>
        <CommentForm postId={comment.postId} replyTo={comment.id} />
    </div>
      )}
      {comment.responses &&
        comment.responses.map((reply) => (
          <CommentCard key={reply.id} comment={reply} />
        ))}
    </div>
  );
};

export default CommentCard;