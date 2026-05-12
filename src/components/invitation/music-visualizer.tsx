'use client';

import { useState, useEffect, useRef } from 'react';

interface MusicVisualizerProps {
  isPlaying: boolean;
}

export function MusicVisualizer({ isPlaying }: MusicVisualizerProps) {
  const [bars, setBars] = useState<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    if (!isPlaying) {
      setBars([0, 0, 0, 0, 0]);
      return;
    }

    const interval = setInterval(() => {
      setBars(Array.from({ length: 5 }, () => 4 + Math.random() * 12));
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex items-end gap-[2px]" style={{ height: 18 }}>
      {bars.map((height, i) => (
        <div
          key={i}
          className="rounded-sm transition-all duration-200"
          style={{
            width: 3,
            height: isPlaying ? height : 2,
            backgroundColor: 'var(--inv-accent)',
            opacity: isPlaying ? 0.8 : 0.3,
          }}
        />
      ))}
    </div>
  );
}
