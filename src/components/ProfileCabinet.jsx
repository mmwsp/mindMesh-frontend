import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../styles/ProfileCabinet.module.scss';
import { changePassword, deleteUserAvatar, updateUserData, uploadAvatar } from '../store/authSlice';
import ProfileChangePasswordForm from './ProfileChangePasswordForm';
import { Settings } from 'lucide-react';

const ProfileCabinet = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [editedFields, setEditedFields] = useState({
    fullname: user.fullname || '',
    login: user.login,
    email: user.email,
  });

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const fileInputRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSettingsClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleEditClick = () => {
    setMenuVisibility(!isMenuVisible);
  };

  const handleDeleteClick = async () => {
    await dispatch(deleteUserAvatar());
    setMenuVisibility(false);
  };

  const handleUploadClick = async () => {
    fileInputRef.current.click();
  };

  const handleAvatarMouseEnter = () => {
    setHovered(true);
  };

  const handleAvatarMouseLeave = () => {
    setHovered(false);
  };

  const toggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
  };

  const handleFieldChange = (e) => {
    setEditedFields({ ...editedFields, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
      const file = e.target.files[0];
      await dispatch(uploadAvatar({ avatar: file }));
      setMenuVisibility(false);
  };

  const handleUpdateProfile = async () => {
    try {
      await dispatch(updateUserData({ id: user.id, updatedFields: editedFields }));
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleChangePassword = async (newPasswords) => {
    try {
      await dispatch(changePassword({ passwords: newPasswords }));
      setShowChangePassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileImageContainer}
          onMouseEnter={handleAvatarMouseEnter}
          onMouseLeave={handleAvatarMouseLeave}>
        {user.profileImage ? (
          <>
            <img src={user.profileImage} alt="Profile Avatar" />
            {hovered && (
              <div className={styles.avatarOverlay} onClick={handleEditClick}>
                <p>Edit</p>
              </div>
            )}
          </>
        ) : ( 
          <>
            <img src="/assets/brain.png" alt="Default Avatar" />
            {hovered && (
              <div className={styles.avatarOverlay} onClick={handleEditClick}>
                <p>Edit</p>
              </div>
            )}
          
          </>
        )}
          {isMenuVisible && (
            <div className={styles.menu}>
              <button onClick={handleDeleteClick}>Delete</button>
              <button onClick={handleUploadClick}>Upload new</button>
              <input type="file" id="avatar"  ref={fileInputRef} style={{ display: 'none' }}  accept="image/*" onChange={handleAvatarChange} />
            </div>
          )}
      </div>

      <div className={styles.profileInfo}>
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
            <h2>{user.login}</h2>
            <p>Username: {user.fullname || <span className={styles.empty}>empty</span>}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Rating: {user.rating}</p>
          </>
        )}
        <br></br><br></br>
         {showChangePassword && (
          <ProfileChangePasswordForm onChangePassword={handleChangePassword} />
        )}
        
      </div>

      <div className={styles.profileButtons}>
        <div onClick={handleSettingsClick}>
          <Settings color="white" size={24} fillOpacity={0} />
        </div>
        {showDropdown && (
           <div className={`${styles.dropdown} ${showDropdown ? styles['show-dropdown'] : ''}`}>
             <button className={styles.editBtn} onClick={() => setEditMode(!editMode)}>Edit Profile</button>
             <button className={styles.editBtn} onClick={toggleChangePassword}>Change Password</button>
             <button className={styles.editBtn}>Delete account</button>
             {editMode && (
                <button onClick={handleUpdateProfile}>Save Changes</button>
              )}
           </div>
          )}  
      </div>

    </div>
  );
};

export default ProfileCabinet;