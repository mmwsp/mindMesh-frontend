import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postReducer from './postSlice';
import commentsReducer from './commentsSlice';

const store = configureStore({
  reducer: {
    posts: postReducer,
    auth: authReducer,
    comments: commentsReducer,
  },
});

export default store;
