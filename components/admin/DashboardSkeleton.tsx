import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-12 w-48 bg-white/10 rounded-lg mb-8"></div>
      
      {/* Grid Skeleton for Actions/Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/10 glass-effect"></div>
        ))}
      </div>

      {/* Table/Content Skeleton */}
      <div className="w-full bg-white/5 rounded-xl border border-white/10 glass-effect p-6 space-y-4">
        <div className="h-8 w-1/4 bg-white/10 rounded-md"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full bg-white/5 rounded-md"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
