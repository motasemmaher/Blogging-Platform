"use client";
import { Post } from '@/lib/types/post'
import { Pagination } from '@/lib/types/api'
import React from 'react'
import { PostsProvider } from '@/contexts/posts-context'
import PostsList from './PostsList'

export default function PostsIndex({posts, pagination}: {posts: Post[], pagination: Pagination}) {
  return (
    <PostsProvider posts={posts} pagination={pagination}>
        <PostsList />
    </PostsProvider>
  )
}
