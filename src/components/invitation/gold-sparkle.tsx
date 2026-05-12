'use client';

import { useEffect, useState, useCallback } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export function GoldSparkle() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const generateSparkles = useCallback(() => {
    const count = 25;
    const newSparkles: Sparkle[] = [];
    for (let i = 0; i < count; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        opacity: 0.2 + Math.random() * 0.5,
        duration: 3 + Math.random() * 6,
        delay: Math.random() * 5,
      });
    }
    return newSparkles;
  }, []);

  useEffect(() => {
    setSparkles(generateSparkles());
    // Regenerate sparkles periodically
    const interval = setInterval(() => {
      setSparkles(generateSparkles());
    }, 8000);
    return () => clearInterval(interval);
  }, [generateSparkles]);

  if (sparkles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
            opacity: 0,
            background: `radial-gradient(circle, var(--inv-accent) 0%, transparent 70%)`,
            boxShadow: `0 0 ${sparkle.size * 2}px var(--inv-accent)`,
            animation: `sparkle-float ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes sparkle-float {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          20% {
            opacity: 0.6;
            transform: translateY(-10px) scale(1);
          }
          50% {
            opacity: 0.3;
            transform: translateY(-25px) scale(0.8);
          }
          80% {
            opacity: 0.5;
            transform: translateY(-40px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(0);
          }
        }
      `}</style>
    </div>
  );
}
