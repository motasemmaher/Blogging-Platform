import * as yup from 'yup';

// Create post validator schema
export const createPostSchema = yup.object({
  title: yup.string().required('Title is required').max(255, 'Title cannot exceed 255 characters'),
  content: yup.string().required('Content is required'),
  published: yup.boolean().default(false),
  categoryIds: yup.array().of(yup.number().required()).default([]),
});

// Update post validator schema
export const updatePostSchema = yup.object({
  title: yup.string().max(255, 'Title cannot exceed 255 characters'),
  content: yup.string(),
  published: yup.boolean(),
  categoryIds: yup.array().of(yup.number().required()),
});

// Get post by ID validator schema
export const getPostByIdSchema = yup.object({
  id: yup.number().required('Post ID is required'),
});

export const getPostsQuerySchema = yup.object({
  search: yup.string().optional(),
  page: yup.number().optional(),
  limit: yup.number().optional(),
});
