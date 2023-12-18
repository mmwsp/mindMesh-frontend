import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Sidebar.module.scss';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <button className={styles.closeButton} onClick={toggleSidebar}>
        &times; {}
      </button>
      <hr></hr>
      <ul>
      {!isAuthenticated ? (
        <>
            <li><Link to="/posts">Posts</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/login">Sign in</Link></li>
            <li><Link to="/registration">Sign up</Link></li>
        </>
      ) : (
        <>
            <li><Link to="/myprofile">My account</Link></li>
            <li><Link to="/create-post">Create post</Link></li>
            <li><Link to="/posts">Posts</Link></li>
            <li><Link to="/users">Users</Link></li>
        </>
      )}

      </ul>
    </div>
  );
};

export default Sidebar;