'use client';

import React from 'react';
import { User } from '@/lib/types/user';

interface AuthorCardProps {
  author: User;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  if (!author) return null;

  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500 text-sm font-semibold">
            {author.name.charAt(0)}
          </span>
        </div>
      </div>
      <div>
        <p className="font-semibold leading-tight">{author.name}</p>
        <p className="text-sm text-gray-500">{author.email}</p>
      </div>
    </div>
  );
} 