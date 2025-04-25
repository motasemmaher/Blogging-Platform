'use client';

import Link from 'next/link';
import { Post } from '@/lib/types/post';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Calendar, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postsApi } from '@/lib/api/posts';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/formatDate';
import { useAuth } from '@/contexts/auth-context';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const handleDelete = async () => {
    if (!post.id) return;

    // Simple confirmation with browser confirm dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await postsApi.deletePost(Number(post.id));
      router.refresh();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-2 text-xl">
            <Link href={`/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </CardTitle>
          {isAuthenticated && post.author.id === user?.id && (
            <div className="flex gap-2">
              <Link href={`/posts/edit/${post.id}`}>
                <Button size="sm" variant="outline" className="h-8 px-2">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <Link
          href={`/posts/${post.id}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Eye className="w-4 h-4 mr-1" />
          Read more
        </Link>
        <span
          className={`text-xs px-2 py-1 rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
        >
          {post.published ? 'Published' : 'Draft'}
        </span>
      </CardFooter>
    </Card>
  );
}

interface PostCardsProps {
  posts: Post[];
}

export function PostCards({ posts }: PostCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
