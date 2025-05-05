import { BackButton } from '@/components/BackButton';

export default function PostLoading() {
  return (
    <div className="w-full">
      {/* Back Button */}
      <div className="mb-6 h-10 w-24 opacity-50">
        <BackButton />
      </div>
      
      <article className="space-y-8">
        {/* Post Header */}
        <header className="space-y-4">
          <div className="h-9 w-4/5 rounded-md bg-muted animate-pulse"></div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-1.5">
              <div className="h-4 w-32 rounded-md bg-muted animate-pulse"></div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-24 rounded-md bg-muted animate-pulse"></div>
                <div className="h-3 w-16 rounded-md bg-muted animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Post Content */}
        <div className="space-y-6">
          <div className="h-5 w-full rounded-md bg-muted animate-pulse"></div>
          <div className="h-5 w-full rounded-md bg-muted animate-pulse"></div>
          <div className="h-5 w-full rounded-md bg-muted animate-pulse"></div>
          <div className="h-5 w-11/12 rounded-md bg-muted animate-pulse"></div>
          <div className="h-5 w-full rounded-md bg-muted animate-pulse"></div>
          
          {/* Block quote or callout */}
          <div className="border-l-4 border-primary/50 pl-4 py-1 my-6">
            <div className="space-y-2">
              <div className="h-5 w-11/12 rounded-md bg-muted animate-pulse"></div>
              <div className="h-5 w-4/5 rounded-md bg-muted animate-pulse"></div>
            </div>
          </div>
          
          <div className="h-5 w-full rounded-md bg-muted animate-pulse"></div>
          <div className="h-5 w-full rounded-md bg-muted animate-pulse"></div>
          <div className="h-5 w-3/4 rounded-md bg-muted animate-pulse"></div>
        </div>
        
        {/* Post Actions */}
        <div className="flex justify-between items-center py-4 border-t border-b border-border">
        <div className="h-9 w-20 rounded-md bg-muted animate-pulse"></div>
        <div className="flex space-x-3">
            <div className="h-9 w-20 rounded-md bg-muted animate-pulse"></div>
          </div>
        </div>
      </article>
      
      {/* Comments Section */}
      <section className="mt-10 space-y-6">
        <div className="h-6 w-32 rounded-md bg-muted animate-pulse"></div>
        
        {/* Comment Form */}
        <div className="rounded-lg border border-border p-4">
          <div className="space-y-4">
            <div className="h-24 w-full rounded-md bg-muted animate-pulse"></div>
            <div className="flex justify-end">
              <div className="h-10 w-28 rounded-md bg-muted animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Comment List */}
        <div className="space-y-6 mt-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-4 w-32 rounded-md bg-muted animate-pulse"></div>
                  <div className="h-3 w-24 rounded-md bg-muted animate-pulse"></div>
                </div>
              </div>
              <div className="pl-12 space-y-2">
                <div className="h-4 w-full rounded-md bg-muted animate-pulse"></div>
                <div className="h-4 w-11/12 rounded-md bg-muted animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 