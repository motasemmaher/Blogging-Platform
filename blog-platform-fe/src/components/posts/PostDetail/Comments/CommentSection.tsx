'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Comment } from '@/lib/types/comments';
import { useComments } from '@/contexts/comments-context';

export default function CommentSection({ postId }: { postId: number }) {
  const { comments, setComments } = useComments();
  const { user } = useAuth();

  // Add a new comment
  const handleAddComment = async (newComment: Comment) => {
    setComments([...(comments || []), newComment]);
  };

  // Delete a comment
  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  return (
    <div className="space-y-8">
      {user ? (
        <CommentForm postId={postId} userId={user.id} onCommentAdded={handleAddComment} />
      ) : (
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-muted-foreground">
              Please <Button variant="link" className="p-0 h-auto" asChild>
                <a href="/auth/login">log in</a>
              </Button> to leave a comment.
            </p>
          </CardContent>
        </Card>
      )}

      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <React.Fragment key={comment.id}>
              <CommentItem
                comment={comment}
                currentUser={user ? user : null}
                onDelete={handleDeleteComment}
              />
              {index < comments.length - 1 && <Separator className="my-4" />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
} 