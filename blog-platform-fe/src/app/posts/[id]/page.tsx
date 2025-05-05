import React from 'react';
import { PostDetail } from '@/components/posts/PostDetail';
import { postsApi } from '@/lib/api/posts';
import { notFound } from 'next/navigation';
import { commentsApi } from '@/lib/api/comments';
import { Metadata } from 'next';
import createMetaDescription from '@/lib/utils/createMetaDescription';
import getReadingTime from '@/lib/utils/getReadingTime';

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const post = await postsApi.getPostById(Number(params.id));
  
  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }
  
  const description = createMetaDescription(post.content);
  
  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.author?.name || 'Unknown'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
    alternates: {
      canonical: `/posts/${params.id}`,
    }
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return notFound();
  }
  const post = await postsApi.getPostById(Number(id));
  if (!post) {
    return notFound();
  }
  
  const comments = await commentsApi.getComments(Number(id));
  const readingTime = getReadingTime(post.content);

  return <PostDetail post={post} readTime={readingTime} comments={comments} />;
}
