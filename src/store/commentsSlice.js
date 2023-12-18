import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import $api from '../axiosConfig';

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, commentData }, { rejectWithValue }) => {
    try {
      const response = await $api.post(`/comments/post/${postId}`, commentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async (postId, { rejectWithValue }) => {
      try {
        const response = await $api.get(`/comments/post/${postId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await $api.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, newContent }) => {
    const response = await $api.patch(`/comments/${commentId}`, { content: newContent });
    return response.data;
  }
);


const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    list: [],
    status: 'idle', // idle, loading, succeeded, failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list.push(action.payload);
        state.error = null;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? action.payload.message || 'Failed to create comment' : 'Failed to create comment';
      })
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message || 'Failed to fetch comments';
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = state.list.filter((comment) => comment.id !==  Number(action.payload.id));
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const commentIndex = state.list.findIndex(comment => comment.id === updatedComment.id);
        
        if (commentIndex !== -1) {
          state.list[commentIndex].content = updatedComment.content;
        }
        state.status = 'succeeded';
      });
  },
});

export default commentsSlice.reducer;