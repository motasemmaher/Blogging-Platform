import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateMetadata() {
  return {
    title: 'Blog Platform - Share Your Thoughts with the World',
    description: 'A platform for writers and readers to connect. Share your stories, read interesting posts, and engage with a community of passionate writers.',
    keywords: 'blog, writing, reading, community, stories, articles, posts',
    openGraph: {
      title: 'Blog Platform - Share Your Thoughts with the World',
      description: 'A platform for writers and readers to connect. Share your stories, read interesting posts, and engage with a community of passionate writers.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog Platform - Share Your Thoughts with the World',
      description: 'A platform for writers and readers to connect. Share your stories, read interesting posts, and engage with a community of passionate writers.',
    },
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-4 justify-center h-full">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Welcome to Blog Platform
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            A place to share your thoughts, ideas, and stories with the world.
          </p>
        </div>
        <div className="space-x-4">
          <Link href="/posts">
            <Button className="h-11 px-8">Read Posts</Button>
          </Link>
          <Link href="/posts/create">
            <Button variant="outline" className="h-11 px-8">
              Start Writing
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex flex-col items-center space-y-2 border-2 border-gray-200 p-6 rounded-lg">
          <div className="p-3 rounded-full bg-blue-50">
            <svg
              className="h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Read</h3>
          <p className="text-center text-gray-500">
            Find and read posts from a variety of writers on different topics.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 border-2 border-gray-200 p-6 rounded-lg">
          <div className="p-3 rounded-full bg-purple-50">
            <svg
              className="h-8 w-8 text-purple-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Write</h3>
          <p className="text-center text-gray-500">
            Create and publish your own posts to share with the community.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 border-2 border-gray-200 p-6 rounded-lg">
          <div className="p-3 rounded-full bg-green-50">
            <svg
              className="h-8 w-8 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Connect</h3>
          <p className="text-center text-gray-500">
            Engage with other writers and readers through comments and discussions.
          </p>
        </div>
      </div>
    </div>
  );
}
