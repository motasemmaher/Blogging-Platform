import * as yup from 'yup';

// Register validator schema
export const createCommentSchema = yup.object({
  content: yup.string().required('Content is required'),
  postId: yup.number().required('Post ID is required'),
});

// Login validator schema
export const postIdSchema = yup.object({
  postId: yup.number().required('Post ID is required'),
});

// Refresh token validator schema
export const commentIdSchema = yup.object({
  commentId: yup.number().required('Comment ID is required'),
});
