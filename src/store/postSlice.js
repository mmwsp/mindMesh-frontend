import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import $api from '../axiosConfig';

export const selectAuthorIdByPostId = (state, postId) => {
  const post = state.posts.list.find(post => post.id === postId);
  return post ? post.author_id : null;
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await $api.get('/posts');
  return response.data;
  });

export const createPost = createAsyncThunk('posts/createPost', async (postData) => {
    const response = await $api.post('/posts', postData);
    return response.data;
  });

  export const fetchSinglePost = createAsyncThunk('posts/fetchSinglePost', async (postId) => {
    const response = await $api.get(`/posts/${postId}`);
    return response.data;
  });

  export const getCategories = createAsyncThunk('post/getCategories', async () => {
    const response = await $api.get('/categories');
    return response.data;
  });

  export const getUserPosts = createAsyncThunk('posts/getUserPosts', async (userId) => {
    const response = await $api.get(`/posts/user/${userId}`);
    return response.data;
  });

  export const getUserActivePosts = createAsyncThunk('posts/getUserPosts', async (userId) => {
    const response = await $api.get(`/posts/user-active/${userId}`);
    return response.data;
  });

  export const deletePost = createAsyncThunk('posts/deletePost', async (postId) => {
      const response = await $api.delete(`/posts/${postId}`);
      return response.data;
  });

  export const updatePostStatus = createAsyncThunk('posts/updatePostStatus', async ({ postId, status }) => {
    const response = await $api.patch(`/posts/${postId}`, { status });
    return response.data;
  });

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    list: [],
    userPosts: [],
    categories: [],
    status: 'idle', // idle, loading, succeeded, failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSinglePost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSinglePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.singlePost = action.payload;
      })
      .addCase(fetchSinglePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userPosts = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.userPosts = state.userPosts.filter((post) => post.id !== Number(action.payload.id));
        state.list = state.list.filter((post) => post.id !== Number(action.payload.id));
      })
      .addCase(updatePostStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.list = state.list.filter((post) => post.id !== Number(id));
        const postToUpdate = state.userPosts.find((post) => post.id === id);
        if (postToUpdate) {
          postToUpdate.status = status;
        }
      });
  },
});

export default postSlice.reducer;

