import React, { useEffect, useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Posts from './components/Posts';
import CreatePost from './components/CreatePost';
import PrivateRoute from './PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import { refreshUser } from './store/authSlice';
import NavigationBar from './components/NavigationBar';
import PostPage from './components/PostPage';
import ProfileCabinet from './components/ProfileCabinet';
import Sidebar from './components/Sidebar';
import styles from './styles/App.module.scss';
import ProfilePage from './components/ProfilePage';
import { getCategories } from './store/postSlice';
import UsersPage from './components/UsersPage';
import UserPage from './components/UserPage';

function App() {
  const dispatch = useDispatch();
  const emailConfirmed = useSelector((state) => state.auth.emailConfirmed);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isCheckingAuth, setCheckingAuth] = useState(true);
 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (localStorage.getItem('token')) {
          await dispatch(refreshUser());
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setCheckingAuth(false);
        dispatch(getCategories());
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (!emailConfirmed && isAuthenticated) {
    return  <div
    style={{
      display: 'block',
      margin: '50vh 0 0 36vw',
      color: 'white',
    }}
  >
    Please confirm your email to access the application.
  </div>
  }

  return (
  <BrowserRouter>
      <div className={styles.app}>
      <NavigationBar/>
      
      </div>
      <Routes>
        <Route path='/registration' element={<RegistrationForm/>} />
        <Route path='/login' element={<LoginForm/>} />
        <Route path='/posts' element={<Posts/>} />
        <Route path="/posts/:postId" element={<PostPage/>} />
        <Route path="/users" element={<UsersPage/>} />
        <Route path="/users/:userId" element={<UserPage/>} />
        <Route
          path="/create-post"
          element={<PrivateRoute> <CreatePost/> </PrivateRoute>}
        />
        <Route path='/myprofile' element={<PrivateRoute> <ProfilePage/> </PrivateRoute>} />
        <Route path="*" element={<Navigate to="/posts" />} />
      </Routes>
  </BrowserRouter>
  );
}

export default App;
