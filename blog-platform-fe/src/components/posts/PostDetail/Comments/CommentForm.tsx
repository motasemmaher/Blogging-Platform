'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { Comment } from '@/lib/types/comments';
import { commentsApi } from '@/lib/api/comments';
import { toast } from 'sonner';
import { commentSchema, CommentFormValues } from '@/lib/validators/comment';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

interface CommentFormProps {
  postId: number;
  userId: number;
  onCommentAdded: (comment: Comment) => void;
}

export default function CommentForm({ postId, userId, onCommentAdded }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Initialize form with React Hook Form and Yup validation
  const form = useForm<CommentFormValues>({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      content: '',
      postId,
      userId,
    },
  });

  // Watch the content field to calculate remaining characters
  const content = form.watch('content');
  const charLimit = 500;
  const remainingChars = charLimit - (content?.length || 0);
  const isOverLimit = remainingChars < 0;

  // Handle form submission
  const onSubmit = async (data: CommentFormValues) => {
    try {
      setIsSubmitting(true);

      const response = await commentsApi.createComment(data);

      // Type assertion for response data
      onCommentAdded(response as Comment);

      // Reset form after successful submission
      form.reset({ content: '', postId, userId });
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  {user?.name ? user.name.charAt(0) : '?'}
                </div>
              </Avatar>

              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Add a comment..."
                          className="resize-none focus-visible:ring-1 focus-visible:ring-ring"
                          maxLength={charLimit}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}
                  >
                    {remainingChars} characters remaining
                  </span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end p-3 pt-0">
            <Button
              type="submit"
              disabled={isSubmitting || isOverLimit || !content?.trim()}
              size="sm"
            >
              <Send className="mr-2 h-4 w-4" />
              Post Comment
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
