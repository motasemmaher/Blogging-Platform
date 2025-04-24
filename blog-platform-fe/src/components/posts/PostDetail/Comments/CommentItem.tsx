'use client';

import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import { MoreVertical } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { Comment } from '@/lib/types/comments';
import { User } from '@/lib/types/user';

interface CommentItemProps {
  comment: Comment;
  currentUser: User | null;
  onDelete: (commentId: string) => void;
}

export default function CommentItem({ comment, currentUser, onDelete }: CommentItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const isAuthor = currentUser && currentUser.id === comment.author.id;
  const formattedDate = formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true });
  
  const handleDelete = async () => {
    if (!comment.id) return;
    
    try {
      setIsDeleting(true);
      await axios.delete(`/api/comments/${comment.id}`);
      onDelete(comment.id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  return (
    <Card className="bg-card border border-border">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <div className="w-full h-full flex items-center justify-center bg-muted">
                {comment.author.name.charAt(0)}
              </div>
            </Avatar>
            <div>
              <div className="font-medium">{comment.author.name}</div>
              <div className="text-xs text-muted-foreground">{formattedDate}</div>
            </div>
          </div>
          
          {isAuthor && !showDeleteConfirm && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="mt-4 text-sm">
          {comment.content}
        </div>
        
        {showDeleteConfirm && (
          <div className="mt-4 border-t pt-4">
            <p className="text-sm mb-2 text-muted-foreground">
              Delete this comment? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 