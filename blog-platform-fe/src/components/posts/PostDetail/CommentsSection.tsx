'use client';

import React from 'react';
import CommentSection from './Comments/CommentSection';

interface CommentsSectionProps {
  postId: number;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments</h2>
      <CommentSection postId={postId} />
    </div>
  );
} 