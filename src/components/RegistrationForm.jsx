import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/RegistrationForm.module.scss';
import ActivationNeeded from './ActivationNeeded';


function RegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ login: '', email: '', password: '', fullname: ''});
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(response)) {
        setRegistrationSuccess(true);
        setRegistrationError(null);
      } else {
        setRegistrationSuccess(false);
        setRegistrationError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationSuccess(false);
      setRegistrationError('Registration failed. Please try again.');
    }
  };

  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated === true) {
       navigate('/posts', {replace: true})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])


  return (
<div className={styles.regContainer}>
<h2 className={styles.signup}>Sign up</h2>
  {registrationSuccess && (
    <ActivationNeeded/>
  )}
  {registrationError && (
    <div className={styles.regError}>
      {registrationError}
    </div>
  )}

  <form className={styles.regForm} onSubmit={handleSubmit}>
    <label className={styles.regLabel}>
      <input className={styles.regInput} type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} />
    </label>
    <label className={styles.regLabel}>
      <input className={styles.regInput} type="text" name="login" placeholder="Enter your login" value={formData.login} onChange={handleInputChange} />
    </label>
    <label className={styles.regLabel}>
      <input className={styles.regInput} type="text" name="fullname" placeholder="Enter your fullname" value={formData.fullname} onChange={handleInputChange} />
    </label>
    <label className={styles.regLabel}>
      <input className={styles.regInput} type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleInputChange} />
    </label>
    <button className={styles.regButton} type="submit">Register</button>
  </form>
</div>
  );
}

export default RegistrationForm;
