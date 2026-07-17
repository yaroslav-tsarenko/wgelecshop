const shimmerBar =
  "rounded animate-shimmer [background:linear-gradient(90deg,var(--color-bg-tertiary)_25%,var(--color-bg-secondary)_50%,var(--color-bg-tertiary)_75%)] [background-size:200%_100%]";

export function ProductSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg)]"
        >
          <div className={`aspect-square ${shimmerBar}`} />
          <div className="flex flex-col gap-2 p-4">
            <div className={`h-2.5 w-2/5 ${shimmerBar}`} />
            <div className={`h-3.5 w-[85%] ${shimmerBar}`} />
            <div className={`h-3.5 w-3/5 ${shimmerBar}`} />
            <div className="mt-2 flex items-center justify-between">
              <div className={`h-[18px] w-[70px] ${shimmerBar}`} />
              <div className={`h-9 w-9 rounded-[var(--radius-lg)] ${shimmerBar}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
