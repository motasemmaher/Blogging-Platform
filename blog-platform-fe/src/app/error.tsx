'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to the console, since I don't have logging service
  console.log(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Something went wrong!</h1>
        <p className="text-gray-500 md:text-xl">
          We&apos;re sorry, but something went wrong. Please try again later.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          className="h-11 px-8"
          onClick={() => reset()}
        >
          Try again
        </Button>
        <Link href="/">
          <Button variant="outline" className="h-11 px-8">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
} 