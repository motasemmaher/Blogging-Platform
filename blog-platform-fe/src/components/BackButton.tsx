'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  label?: string;
  className?: string;
}

export function BackButton({ label = 'Back to posts', className = 'mb-6' }: BackButtonProps) {
  return (
    <Button variant="ghost" size="sm" className={className} onClick={() => window.history.back()}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
