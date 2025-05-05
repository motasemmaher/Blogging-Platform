'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/types/post';
import { postsApi } from '@/lib/api/posts';
import { postSchema } from '@/lib/validators/post';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackButton } from '../BackButton';
import { toast } from 'sonner';

// Define form values type based on the schema
type FormValues = {
  title: string;
  content: string;
  published: boolean;
};

export interface PostFormProps {
  initialData?: Post;
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const defaultValues: FormValues = {
    title: initialData?.title || '',
    content: initialData?.content || '',
    published: initialData?.published || false,
  };

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(postSchema),
    defaultValues,
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Create a complete post object by merging form data with initial data
      const postData = {
        ...initialData,
        ...data,
        // Set default fields if this is a new post
        author: initialData?.author || { id: '1', name: 'Current User', email: 'user@example.com' },
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isEditMode && initialData?.id) {
        await postsApi.updatePost(Number(initialData.id), postData as Post);
      } else {
        await postsApi.createPost(postData as Post);
      }

      // Navigate back to posts list on success
      router.push('/posts');
      router.refresh();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BackButton />
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isEditMode ? 'Edit Post' : 'Create Post'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Post title"
                className="w-full"
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">
                Content
              </Label>
              <Textarea
                id="content"
                {...register('content')}
                placeholder="Write your post content here..."
                className="min-h-[200px] resize-y"
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 rounded-md border p-4">
              <input
                id="published"
                type="checkbox"
                {...register('published')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="published" className="font-normal text-sm">
                Publish immediately
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Post' : 'Create Post'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
