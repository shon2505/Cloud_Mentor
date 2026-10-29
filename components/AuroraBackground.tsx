'use client';

import React from 'react';

export const AuroraBackground: React.FC = () => {
  return (
    <div className="aurora-canvas" aria-hidden="true">
      {/* Aurora Blob 1 - Vibrant Teal */}
      <div className="aurora-blob aurora-blob-1" />
      {/* Aurora Blob 2 - Electric Cyan */}
      <div className="aurora-blob aurora-blob-2" />
      {/* Aurora Blob 3 - Aurora Violet */}
      <div className="aurora-blob aurora-blob-3" />
      {/* Aurora Blob 4 - Soft Magenta */}
      <div className="aurora-blob aurora-blob-4" />
      {/* Subtle fine noise overlay for depth */}
      <div className="absolute inset-0 bg-transparent pointer-events-none" />
    </div>
  );
};
