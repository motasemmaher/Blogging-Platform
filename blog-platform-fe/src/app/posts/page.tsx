import React from 'react';
import { postsApi } from '@/lib/api/posts';
import PostsIndex from '@/components/posts';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ search: string; page: string }>;
}) {
  const { search, page } = await searchParams;

  const { posts, pagination } = await postsApi.getPosts(parseInt(page || '1'), 10, search);

  return <PostsIndex posts={posts} pagination={pagination} />;
}
