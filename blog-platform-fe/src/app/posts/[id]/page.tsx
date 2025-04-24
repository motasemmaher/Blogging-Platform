import React from 'react';
import { PostDetail } from '@/components/posts/PostDetail';
import { postsApi } from '@/lib/api/posts';
import { notFound } from 'next/navigation';
import { commentsApi } from '@/lib/api/comments';

const getReadingTime = (content: string) => {
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / 200); // Avg reading speed of 200 words per minute
  return `${time} min read`;
}

export default async function PostPage({params}: {params: Promise<{id: string}>}) {
  const { id } = await params;
  if (!id) {
    return notFound();
  }
  const post = await postsApi.getPostById(Number(id));
  const comments = await commentsApi.getComments(Number(id));
  const readingTime = getReadingTime(post.content);
  
  if (!post) {
    return notFound();
  }

  return <PostDetail post={post} readTime={readingTime} comments={comments} />;
}
