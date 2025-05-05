import React from 'react';
import { postsApi } from '@/lib/api/posts';
import PostsIndex from '@/components/posts';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search: string; page: string }>;
}) {
  const { search, page } = await searchParams;
  const currentPage = parseInt(page || '1');
  const pageTitle = search 
    ? `Search Results for "${search}" - Page ${currentPage}`
    : `Blog Posts - Page ${currentPage}`;

  return {
    title: pageTitle,
    description: 'Browse our collection of blog posts. Find interesting articles, insights, and updates on various topics.',
    openGraph: {
      title: pageTitle,
      description: 'Browse our collection of blog posts. Find interesting articles, insights, and updates on various topics.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: 'Browse our collection of blog posts. Find interesting articles, insights, and updates on various topics.',
    },
    alternates: {
      canonical: search 
        ? `/posts?search=${encodeURIComponent(search)}&page=${currentPage}`
        : `/posts?page=${currentPage}`,
    },
  };
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ search: string; page: string }>;
}) {
  const { search, page } = await searchParams;

  const { posts, pagination } = await postsApi.getPosts(parseInt(page || '1'), 10, search);

  return <PostsIndex posts={posts} pagination={pagination} />;
}
