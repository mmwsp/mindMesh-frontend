import React from 'react';
import CommentCard from './CommentCard';

const CommentList = ({ commentsArr }) => {


    function getThreadedComments(commentsArr) {
        const comments = [];
      
        for (let comment of commentsArr) {
          if (comment.reply) {
            const index = comments.findIndex((i) => i.id === comment.reply);
      

            if (index !== -1 && comments[index]) {
              comments[index].responses.push(comment);
            }
          } else {
            comments.push({ ...comment, responses: [] });
          }
        }
      
        return comments;
      }


    const comments = getThreadedComments(commentsArr);

  return (
    <div>
        {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment}/>
          ))} 
    </div>
  );
};

export default CommentList;