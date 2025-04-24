'use client';

import React, { useState } from 'react';
import { Share2, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostActionsProps {
  title: string;
}

export function PostActions({ title }: PostActionsProps) {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="flex items-center justify-between py-6 border-y border-border my-8">
      <div className="flex items-center space-x-4">
        <Button
          variant={isLiked ? "default" : "outline"}
          size="sm"
          onClick={handleLike}
          className={isLiked ? "bg-primary text-primary-foreground" : ""}
        >
          <ThumbsUp className="mr-1 h-4 w-4" />
          {likeCount} Likes
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: title,
              text: `Check out this post: ${title}`,
              url: window.location.href,
            }).catch(err => console.log('Error sharing:', err));
          } else {
            navigator.clipboard.writeText(window.location.href);
          }
        }}
      >
        <Share2 className="mr-1 h-4 w-4" />
        Share
      </Button>
    </div>
  );
} 