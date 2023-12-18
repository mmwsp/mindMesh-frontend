import React, { useEffect } from 'react';
import styles from '../styles/UserItem.module.scss';

const UserItem = ({user}) => {
 

  
    return (
    <div className={styles.userItem}>
        <div className={styles.userInfo}>
            <p className={styles.infoItem}>Login: {user.login}</p>
            <p className={styles.infoItem}>Rating: {user.rating}</p>
            <p className={styles.infoItem}>Role: {user.role}</p>
            <p className={styles.infoItem}>Fullname: {user.fullname}</p>
        </div>
        <div className={styles.avatarContainer}>
            {user.profileImage ? (
            <img src={user.profileImage} className={styles.authorAvatar} alt="Profile" />
            ) : (
            <img src="/assets/brain.png" className={styles.authorAvatar} alt="Default" />
            )}
        </div>
    </div>
    );
  };
  
  export default UserItem;