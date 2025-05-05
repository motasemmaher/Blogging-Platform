import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404 - Page Not Found</h1>
        <p className="text-gray-500 md:text-xl">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button className="h-11 px-8">Go Home</Button>
        </Link>
        <Link href="/posts">
          <Button variant="outline" className="h-11 px-8">
            Browse Posts
          </Button>
        </Link>
      </div>
    </div>
  );
}
