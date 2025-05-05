import React from 'react';

export default function PostsLoading() {
  return (
    <div className="w-full space-y-8">
      {/* Header with Search Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-10 w-64 rounded-md bg-muted animate-pulse"></div>
        <div className="h-10 w-32 rounded-md bg-muted animate-pulse"></div>
      </div>
      
      {/* Post Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border border-border rounded-lg p-6 space-y-4">
            {/* Post Title */}
            <div className="h-6 w-3/4 rounded-md bg-muted animate-pulse"></div>
            
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
              <div className="h-4 w-32 rounded-md bg-muted animate-pulse"></div>
            </div>
            
            {/* Content */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded-md bg-muted animate-pulse"></div>
              <div className="h-4 w-full rounded-md bg-muted animate-pulse"></div>
              <div className="h-4 w-3/4 rounded-md bg-muted animate-pulse"></div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 rounded-md bg-muted animate-pulse"></div>
              <div className="h-4 w-24 rounded-md bg-muted animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <div className="h-10 w-10 rounded-md bg-muted animate-pulse"></div>
        <div className="h-10 w-10 rounded-md bg-muted animate-pulse"></div>
        <div className="h-10 w-10 rounded-md bg-muted animate-pulse"></div>
      </div>
    </div>
  );
} 