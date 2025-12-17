function SectionSkeleton() {
  return (
    <div className="w-full py-16">
      <div className="container max-w-7xl">
        <div className="bg-muted/50 mb-4 h-8 w-64 animate-pulse rounded" />
        <div className="bg-muted/30 mb-8 h-4 w-96 animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-muted/30 h-64 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SectionSkeleton;
