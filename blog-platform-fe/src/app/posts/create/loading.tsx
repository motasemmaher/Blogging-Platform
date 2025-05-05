import { BackButton } from '@/components/BackButton';

export default function EditPostLoading() {
  return (
    <div className="w-full">
      {/* Back Button */}
      <div className="mb-6 h-10 w-24 opacity-50">
        <BackButton />
      </div>
      
      {/* Card Skeleton */}
      <div className="w-full rounded-lg border border-border bg-card shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="h-8 w-40 rounded-md bg-muted animate-pulse"></div>
        </div>
        
        {/* Card Content */}
        <div className="p-6 pt-0 space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <div className="h-5 w-16 rounded-md bg-muted animate-pulse"></div>
            <div className="h-10 w-full rounded-md border border-border bg-muted animate-pulse"></div>
          </div>
          
          {/* Content Field */}
          <div className="space-y-2">
            <div className="h-5 w-24 rounded-md bg-muted animate-pulse"></div>
            <div className="min-h-[200px] w-full rounded-md border border-border bg-muted animate-pulse"></div>
          </div>
          
          {/* Published Checkbox */}
          <div className="flex items-center space-x-2 rounded-md border border-border p-4">
            <div className="h-4 w-4 rounded bg-muted animate-pulse"></div>
            <div className="h-5 w-40 rounded-md bg-muted animate-pulse"></div>
          </div>
          
          {/* Submit Button */}
          <div className="w-full h-10 rounded-md bg-primary/70 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 