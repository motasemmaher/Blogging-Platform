export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Pulse animation container */}
        <div className="relative">
          {/* Multiple circle animations */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
          <div className="relative w-16 h-16 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
        </div>
        
        {/* Text with fade-in animation */}
        <div className="flex flex-col items-center animate-pulse">
          <h3 className="text-lg font-medium text-foreground">Loading</h3>
          <div className="flex space-x-1 mt-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
} 