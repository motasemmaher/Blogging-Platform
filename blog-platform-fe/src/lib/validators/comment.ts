import * as yup from 'yup';

/**
 * Validation schema for comment creation/editing
 */
export const commentSchema = yup.object({
  content: yup
    .string()
    .required('Comment content is required')
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment cannot exceed 500 characters'),
  postId: yup
    .number()
    .required('Post ID is required'),
  userId: yup
    .number()
    .required('User ID is required'),
});

/**
 * Type definition for comment form values based on the schema
 */
export type CommentFormValues = yup.InferType<typeof commentSchema>; 