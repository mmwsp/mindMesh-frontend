import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../store/authSlice';
import UserItem from './UserItem';
import styles from '../styles/UsersPage.module.scss'; 
import { Link } from 'react-router-dom';

const UsersPage = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.auth.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <div className={styles.usersPage}>
      <h1 className={styles.usersHeader}>Users</h1>
      <div className={styles.userList}>
        {users.map((user) => (
          <Link className={styles.decor} key={user.id} to={`/users/${user.id}`}>
               <UserItem user={user} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;