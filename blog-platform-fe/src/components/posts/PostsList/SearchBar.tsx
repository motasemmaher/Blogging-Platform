'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Create new URL with search query
    const params = new URLSearchParams(searchParams);

    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }

    // Reset to page 1 when searching
    params.set('page', '1');

    router.push(`/posts?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="search"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="sm">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
