import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSinglePost } from '../store/postSlice';
import styles from '../styles/PostPage.module.scss';
import CommentForm from './CommentForm';
import { fetchComments } from '../store/commentsSlice';
import CommentList from './CommentList';
import Reactions from './Reactions';

function PostPage() {
    const { postId } = useParams();
    const dispatch = useDispatch();
    const { singlePost, /*status, error*/ } = useSelector((state) => state.posts);
    const commentsState = useSelector((state) => state.comments);
    
  useEffect(() => {
    dispatch(fetchSinglePost(postId));
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  /*if (commentsState.status === 'loading') {
    return <div>Loading...</div>;
  }

  if (commentsState.status === 'failed') {
    return <div>Error: {commentsState.error}</div>;
  } */

  if (!singlePost) {
    return <div>Post not found</div>;
  }

  const comments = commentsState.list || [];

    return (
        <div className={styles.postPage}>
            <div className={styles.postCard}>
                <h3 className={styles.postTitle}>{singlePost.title}</h3>
                <div className={styles.authorSection}>
                    {singlePost.author_avatar ? (
                        <img src={singlePost.author_avatar} className={styles.authorAvatar} alt="img" />
                      ) : (
                        <img src="/assets/brain.png" className={styles.authorAvatar} alt="img" />                
                      )} 
                    <p>Author: {singlePost.author_name}</p>
                </div>
                <div className={styles.categoriesContainer}>
                  {singlePost.categories.map((category, index) => (
                    <div key={index} className={styles.categoryBlock}>
                      {category}
                    </div>
                  ))}
                </div>
                <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: singlePost.content }}
                />
                <p className={styles.publishDate}>{new Date(singlePost.publish_date).toLocaleString()}</p>
                <div className={styles.reactions}>
                    <Reactions postId={singlePost.id} commentId={null} item={singlePost}/>
                </div>
            </div>
            <CommentForm postId={postId}/>
          <div className={styles.commentList}>
            <CommentList commentsArr={comments} postId={singlePost.id}/>
        </div>
      </div>
    );
}

export default PostPage;
