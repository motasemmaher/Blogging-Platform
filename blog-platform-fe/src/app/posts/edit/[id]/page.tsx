import { notFound } from 'next/navigation';
import { PostForm } from '@/components/forms/post-form';
import { postsApi } from '@/lib/api/posts';
import { cookies } from 'next/headers';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  const post = await postsApi.getPostById(Number(id));
  const cookieStore = await cookies();
  const user = JSON.parse(cookieStore.get('user')?.value || '{}');

  if (!post || post.author.id !== user.id) {
    return notFound();
  }

  return <PostForm initialData={post} />;
}
