import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import $api from '../axiosConfig';


export const createReaction = createAsyncThunk('reactions/createReaction', async ({ postId, commentId, reactionType }) => {
  if(!postId) {
    const response = await $api.post(`comments/${commentId}/reaction`, { reactionType });
    return response.data;
  } 
  else if (!commentId) {
    const response = await $api.post(`posts/${postId}/reaction`, { reactionType });
    return response.data;
  }
});


export const deleteReaction = createAsyncThunk('reactions/deleteReaction', async ({ postId, commentId, reactionType }) => {
    if(!postId) { 
        const response = await $api.delete(`comments/${commentId}/reaction`, { reactionType });
        return response.data;
    }
    else if (!commentId) {
        const response = await $api.delete(`posts/${postId}/reaction`, { reactionType });
        return response.data;
      }
});

export const checkUserReaction = createAsyncThunk(
    'reactions/checkUserReaction',
    async ({ postId, commentId }) => {
        if(!postId) { 
            const response = await $api.get(`comments/check-reaction/${commentId}`, { commentId });
            return response.data;
        }
        else if(!commentId) {
            const response = await $api.get(`posts/check-reaction/${postId}`, { postId });
            return response.data;
        }
    }
  );

const reactionSlice = createSlice({
  name: 'reactions',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
  
    builder
      .addCase(createReaction.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteReaction.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      });

 
    builder
      .addCase(createReaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteReaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

 
    builder
      .addCase(createReaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReaction.pending, (state) => {
        state.loading = true;
      });
  },
});

export default reactionSlice.reducer;