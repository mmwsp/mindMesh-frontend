import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../styles/ProfileCabinet.module.scss';
import { changePassword, updateUserData, uploadAvatar } from '../store/authSlice';


const ProfileCabinet = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [editedFields, setEditedFields] = useState({
    fullname: user.fullname || '',
    login: user.login,
    email: user.email,
  });
  const [avatar, setAvatar] = useState(null);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [showChangePassword, setShowChangePassword] = useState(false);

  const toggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
  };



  const handleFieldChange = (e) => {
    setEditedFields({ ...editedFields, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      await dispatch(updateUserData({ id: user.id, updatedFields: editedFields }));
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleUpdateAvatar = async () => {
    try {
      await dispatch(uploadAvatar({ avatar }));
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      await dispatch(changePassword({ passwords }));
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileImageContainer}>
        {user.profileImage ? (
          <img src={user.profileImage} alt="Profile Avatar" />
        ) : (
          <img src="/assets/brain.png" alt="Default Avatar" />
        )}
      </div>
      <div className={styles.profileInfo}>
        <h2>User Profile</h2>
        {editMode ? (
          <>
            <input
              type="text"
              name="fullname"
              className={styles.myinput}
              value={editedFields.fullname}
              onChange={handleFieldChange}
            />
            <input
              type="text"
              name="login"
              className={styles.myinput}
              value={editedFields.login}
              onChange={handleFieldChange}
            />
            <input
              type="text"
              name="email"
              className={styles.myinput}
              value={editedFields.email}
              onChange={handleFieldChange}
            />
          </>
        ) : (
          <>
            <p>Username: {user.fullname || <span className={styles.empty}>empty</span>}</p>
            <p>Login: {user.login}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Rating: {user.rating}</p>
          </>
        )}
        <label htmlFor="avatar" className={styles.inputFile}>Change profile image</label>
        <input type="file" id="avatar"  accept="image/*" onChange={handleAvatarChange} />
        <button onClick={handleUpdateAvatar}>Upload Avatar</button>
        {showChangePassword && (
              <>
                <label htmlFor="oldPassword">Old Password:</label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                />
                <label htmlFor="newPassword">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                />
                <button onClick={handleChangePassword}>Submit</button>
              </>
            )}
            <button onClick={toggleChangePassword}>Change Password</button>
      </div>
      <div className={styles.profileButtons}>
        {editMode ? (
          <button onClick={handleUpdateProfile}>Save Changes</button>
        ) : (
          <button className={styles.editBtn} onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
      </div>

    </div>
  );
};

export default ProfileCabinet;