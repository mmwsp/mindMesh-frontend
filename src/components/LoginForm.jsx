import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/LoginForm.module.scss';

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(response)) {
        setLoginSuccess(true);
        setLoginError(null);
      } else {
        setLoginSuccess(false);
        setLoginError(response.payload.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated === true) {
       navigate("/posts", {replace: true});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isAuthenticated])

  useEffect(() => {
    if (loginSuccess) {
      navigate('/create-post');
    }
  }, [loginSuccess, navigate]);

  return (
    <div className={styles.container}>
    <h2 className={styles.sign}>Sign in</h2>
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.label}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16">
        <g id="man-people-user" data-iconmelon="Streamline Icon Set:de32eb2621491c1a881a9fe846236da1">
    <g id="Expanded">
      <g>
        <g>
          <path  d="M16.028,20c-4.764,0-8.639-4.486-8.639-10s3.875-10,8.639-10c4.763,0,8.638,4.486,8.638,10
				S20.791,20,16.028,20z M16.028,1.333C12,1.333,8.722,5.221,8.722,10s3.277,8.667,7.306,8.667c4.029,0,7.306-3.888,7.306-8.667
				S20.057,1.333,16.028,1.333z"></path>
        </g>
      <g>
         <path  d="M31.988,32H0.012v-4.515c0-1.967,1.245-3.733,3.097-4.395l8.224-2.266v-2.77h1.333v3.785L3.51,24.361
				c-1.275,0.458-2.165,1.72-2.165,3.124v3.182h29.309v-3.182c0-1.404-0.889-2.666-2.213-3.139l-9.107-2.506v-3.758h1.332v2.742
				l8.178,2.251c1.9,0.677,3.145,2.442,3.145,4.409V32z"></path>
       </g>
       <g>
                    <path  d="M21.865,8.812c-0.045,0-0.09-0.001-0.137-0.003c-1.5-0.055-3.25-1.004-4.361-2.287
				C16.59,7.513,15.48,8.15,14.106,8.383c-2.403,0.413-5.152-0.51-5.988-1.321l0.928-0.957c0.403,0.391,2.69,1.329,4.836,0.964
				c1.332-0.226,2.292-0.911,2.854-2.034l0.558-1.114l0.617,1.082c0.738,1.292,2.508,2.425,3.867,2.475
				c0.604,0.016,1.033-0.165,1.307-0.571l1.105,0.745C23.686,8.403,22.863,8.812,21.865,8.812z"></path>
                  </g>
                </g>
              </g>
            </g>
        </svg>
        <div className={styles.inputcontainer}>
          <input
            type="email"
            name="email"
            className={styles.input1}
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
        </div>
      </label>
      <br />
      <label className={styles.label}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16">
          <g id="lock-locker" data-iconmelon="Streamline Icon Set:5d43c6f45cdbecfd5b8a12bc9e5dd33c">
            <g id="Expanded">
              <g>
                <g>
                  <circle cx="16" cy="20" r="1.333"></circle>
                </g>
                <g>
                  <path d="M16,25.333c-0.369,0-0.667-0.298-0.667-0.666v-4C15.333,20.298,15.631,20,16,20s0.667,0.298,0.667,0.667v4C16.667,25.035,16.369,25.333,16,25.333z"></path>
                </g>
                <g>
                  <path d="M28,32H4V12h24V32z M5.333,30.667h21.333V13.333H5.333V30.667z"></path>
                </g>
                <g>
                  <path d="M24,12.667h-1.333V8c0-3.676-2.991-6.667-6.667-6.667c-3.676,0-6.667,2.99-6.667,6.667v4.667H8V8c0-4.412,3.588-8,8-8c4.411,0,8,3.588,8,8V12.667z"></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <div className={styles.inputcontainer}>
          <input
            type="password"
            className={styles.input1}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
        </div>
      </label>
      <br />
      {loginError && <div className={styles.errorText}>{loginError}</div>}
      <button className={styles.button2} type="submit">Login</button>
    </form>
  </div>
 
  );
}

export default LoginForm;