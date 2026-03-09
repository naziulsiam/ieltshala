const Shimmer = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`animate-pulse bg-secondary rounded-lg ${className}`} style={style} />
);

export const CardSkeleton = () => (
  <div className="bg-card rounded-xl p-5 shadow-card space-y-3">
    <div className="flex items-center gap-3">
      <Shimmer className="w-9 h-9 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-2/3" />
        <Shimmer className="h-3 w-1/2" />
      </div>
    </div>
    <Shimmer className="h-3 w-full" />
    <Shimmer className="h-3 w-4/5" />
  </div>
);

export const ListItemSkeleton = () => (
  <div className="flex items-center gap-3 px-5 py-3.5">
    <Shimmer className="w-9 h-9 rounded-lg shrink-0" />
    <div className="flex-1 space-y-2">
      <Shimmer className="h-3.5 w-3/5" />
      <Shimmer className="h-3 w-2/5" />
    </div>
    <Shimmer className="w-16 h-7 rounded-md" />
  </div>
);

export const DashboardSkeleton = () => (
  <div className="p-4 md:p-6 max-w-[960px] mx-auto space-y-6">
    <div className="space-y-2">
      <Shimmer className="h-7 w-64" />
      <Shimmer className="h-4 w-48" />
    </div>
    <div className="bg-card rounded-xl p-5 shadow-card flex items-center gap-6">
      <Shimmer className="w-[100px] h-[100px] rounded-full shrink-0" />
      <div className="flex-1 space-y-3">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-3 w-48" />
        <Shimmer className="h-2 w-full rounded-full" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
    <div className="bg-card rounded-xl p-5 shadow-card">
      <Shimmer className="h-5 w-36 mb-4" />
      <div className="flex items-end gap-2 h-28">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <Shimmer className="w-full max-w-[32px] rounded-md" style={{ height: `${20 + Math.random() * 60}px` }} />
            <Shimmer className="h-3 w-6" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const AudioSkeleton = () => (
  <div className="bg-card rounded-xl p-5 shadow-card space-y-4">
    <div className="flex items-center gap-3">
      <Shimmer className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <Shimmer className="h-2 w-full rounded-full" />
        <div className="flex justify-between mt-2">
          <Shimmer className="h-3 w-10" />
          <Shimmer className="h-3 w-10" />
        </div>
      </div>
    </div>
    {/* Waveform bars */}
    <div className="flex items-center gap-[2px] h-10 justify-center">
      {Array.from({ length: 40 }).map((_, i) => (
        <Shimmer
          key={i}
          className="w-1 rounded-full"
          style={{ height: `${8 + Math.sin(i * 0.5) * 16 + Math.random() * 8}px` }}
        />
      ))}
    </div>
  </div>
);

export default Shimmer;
