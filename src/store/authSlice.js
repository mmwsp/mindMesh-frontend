import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import $api from '../axiosConfig';

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await $api.post('/auth/register', userData);
    const { accessToken, refreshToken, user } = response.data;
    localStorage.setItem('token', accessToken);

    return { user, accessToken, refreshToken };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await $api.post('/auth/login', userData);
    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem('token', accessToken);

    return { user, accessToken, refreshToken };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await $api.post('/auth/logout');
    localStorage.removeItem('token');
    return null;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const refreshUser = createAsyncThunk('auth/refreshUser', async (_, { rejectWithValue }) => {
  try {
    const response = await $api.get('/auth/refresh');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateUserData = createAsyncThunk(
  'auth/updateUserData',
  async ({ updatedFields }, { rejectWithValue }) => {
    try {
      const response = await $api.patch(`users/update`, updatedFields);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async ({ avatar }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('photo', avatar);

      const response = await $api.patch(`users/avatar`, formData);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ passwords }, { rejectWithValue }) => {
    try {
      const response = await $api.post(`users/changepass`, passwords);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk('users/deleteUser', async ( userId , { rejectWithValue }) => {
  try {
    const response = await $api.delete(`users/${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getUsers = createAsyncThunk('users/getUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await $api.get(`users/`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getUser = createAsyncThunk('users/getUser', async (userId) => {
  const response = await $api.get(`/users/${userId}`);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    users: [],
    watchedUser: null,
    isAuthenticated: false,
    emailConfirmed: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.emailConfirmed = action.payload.user.emailConfirmed;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.emailConfirmed = action.payload.user.emailConfirmed;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.error.message;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.emailConfirmed = action.payload.user.emailConfirmed;
        state.error = null;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.emailConfirmed = false;
        state.error = action.payload.message || 'Error refreshing user';
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.emailConfirmed = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.emailConfirmed = false;
        state.error = action.payload.message || 'Error logging out';
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        //state.user = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.emailConfirmed = false;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.watchedUser = action.payload;
      });

  },
});


export default authSlice.reducer;
