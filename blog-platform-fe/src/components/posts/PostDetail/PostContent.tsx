'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PostContentProps {
  content: string | React.ReactNode;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="prose prose-lg max-w-none pb-6">
        {typeof content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          content
        )}
      </CardContent>
    </Card>
  );
} 