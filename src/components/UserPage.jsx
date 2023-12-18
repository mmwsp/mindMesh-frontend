import React, { useEffect, useState } from "react";
import styles from '../styles/UserPage.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUser } from "../store/authSlice";
import { useNavigate, useParams } from 'react-router-dom';
import { getUserActivePosts } from "../store/postSlice";
import Post from "./PostCard";

const UserPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useParams();
    const user = useSelector((state) => state.auth.watchedUser);
    const currentUsr = useSelector((state) => state.auth?.user || 0);
    const userPosts = useSelector((state) => state.posts.userPosts);
    const [optionsVisible, setOptionsVisible] = useState(false);

    
    useEffect(() => {
         dispatch(getUser(userId));
         dispatch(getUserActivePosts(userId));
      }, [dispatch, userId]);

      if (!user) {
        console.log(userId)
        return <div>User not found</div>;
      }

      if(user.id === currentUsr.id) {
        navigate('/myprofile', {replace: true});
      }

      const handleDeleteUser = () => {
        dispatch(deleteUser(userId));
        setOptionsVisible(false);  
        navigate('/users');
    };

    const handleOptionsClick = (e) => {
        e.stopPropagation();
        setOptionsVisible(!optionsVisible);  
      };


    return (
        <div>
            <div className={styles.profileContainer}>
                <div className={styles.profileImageContainer}>
                {user && user.profileImage ? (
                    <img src={user.profileImage} alt="Profile Avatar" />
                ) : (
                    <img src="/assets/brain.png" alt="Default Avatar" />
                )}
                </div>
                <div className={styles.profileInfo}>
                <h2>User Profile</h2>

                    <p>Username: {user.fullname || <span className={styles.empty}>empty</span>}</p>
                    <p>Login: {user.login}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Rating: {user.rating}</p>
                </div>
                {currentUsr.role === 'admin' && (
                  <div className={styles.optionsContainer}>
                        <div className={styles.optionsIcon} onClick={handleOptionsClick}>
                            ...
                        </div>
                    {optionsVisible && (
                        <div className={styles.optionsMenu}>
                        <div onClick={handleDeleteUser}>Delete</div>
                        </div>
                    )}
                </div>
                )}
            </div>  
                <div className={styles.mypostsContainer}>
                    <h1 className={styles.mypostsh}>User posts</h1>
                    <div>
                        {userPosts.map((post) => (
                        <Post key={post.id} post={post} />
                        ))}
                    </div>
                    {userPosts.length === 0 && <p>No posts found</p>}
                </div>
        </div>
    );
};

export default UserPage;