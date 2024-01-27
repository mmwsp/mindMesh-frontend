import React, { useState } from 'react';

const ProfileChangePasswordForm = ({ onChangePassword }) => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onChangePassword(passwords);
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProfileChangePasswordForm;