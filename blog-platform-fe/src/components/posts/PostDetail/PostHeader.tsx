'use client';

import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatDate';
import { Post } from '@/lib/types/post';
import AuthorCard from '@/components/Users/AuthorCard';
interface PostHeaderProps {
  post: Post;
  readTime: string;
}

export function PostHeader({ post, readTime }: PostHeaderProps) {
  return (
    <div className="space-y-6 mb-10">
      <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <AuthorCard author={post.author} />

        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <time>{formatDate(post.createdAt || new Date().toISOString())}</time>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
