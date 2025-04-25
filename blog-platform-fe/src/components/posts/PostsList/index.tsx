'use client';

import { useSearchParams } from 'next/navigation';
import { usePosts } from '@/contexts/posts-context';
import { PostCards } from './Cards';
import { SearchBar } from './SearchBar';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { PostPagination } from './PostPagination';
import { useAuth } from '@/contexts/auth-context';

export default function PostsList() {
  const searchParams = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const { posts, pagination } = usePosts();
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Posts</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-start sm:items-center">
          <SearchBar />
          {isAuthenticated && (
            <Link href="/posts/create">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No posts found</h2>
          {searchParam ? (
            <p className="text-gray-600 mb-4">
              No posts matching &ldquo;{searchParam}&rdquo; were found. Try another search or create
              a new post.
            </p>
          ) : (
            <p className="text-gray-600 mb-4">Get started by creating your first blog post</p>
          )}
          <Link href="/posts/create">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <PostCards posts={posts} />

          {pagination && pagination.totalPages > 1 && (
            <PostPagination
              baseUrl="posts"
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              searchParam={searchParam}
            />
          )}
        </>
      )}
    </div>
  );
}
