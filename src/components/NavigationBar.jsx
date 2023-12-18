import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/authSlice';
import styles from '../styles/NavigationBar.module.scss';
import Sidebar from './Sidebar';

const NavigationBar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className={styles.nav}>
    <button className={styles.toggleButton} onClick={toggleSidebar}>
          &#9776;
      </button>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    <div className={styles.logo}   onClick={() => navigate('/posts')}>mind_mesh/</div>
    <div className={styles.userSection}>
      {!isAuthenticated ? (
        <>
          <Link to="/login" className={styles.navLink}>
            Login
          </Link>
          <Link to="/registration" className={styles.navLink}>
            Sign up
          </Link>
        </>
      ) : (
        <>
          <div
            onClick={() => navigate('/myprofile')}
            className={styles.userProfile}
          >
            {user && user.login}
            {user && user.profileImage ? (
              <img src={user.profileImage} className={styles.avatarPlaceholder} alt="img" />
            ) : (
              <img src="/assets/brain.png" className={styles.avatarPlaceholder} alt="img" />
            
            )}
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <img src="/assets/logout.png" alt="Logout" className={styles.logoutImage} />
          </button>
        </>
      )}
    </div>
  </nav>
  );
};

export default NavigationBar;
