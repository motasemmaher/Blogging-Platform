import * as yup from 'yup';

// Create/edit post form validation schema
export const postSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .max(255, 'Title cannot exceed 255 characters'),
  content: yup
    .string()
    .required('Content is required'),
  published: yup
    .boolean()
    .default(false),
}); 