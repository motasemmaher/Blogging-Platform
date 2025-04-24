'use client';

import React from 'react';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostActions } from './PostActions';
import { CommentsSection } from './CommentsSection';
import { BackButton } from '@/components/BackButton';
import { Post } from '@/lib/types/post';
import { Comment } from '@/lib/types/comments';
import { CommentsProvider } from '@/contexts/comments-context';

interface PostDetailProps {
  post: Post;
  readTime?: string;
  comments: Comment[];
}

export function PostDetail({
  post,
  readTime = '5 min',
  comments
}: PostDetailProps) {
  return (
    <CommentsProvider comments={comments}>
      <BackButton />
      
      <PostHeader post={post} readTime={readTime} />
      
      <PostContent content={post.content} />
      
      <PostActions title={post.title} />
      
      <CommentsSection postId={post.id!} />
    </CommentsProvider>
  );
}
