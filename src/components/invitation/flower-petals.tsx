'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useInvitationTheme } from './theme-provider';

interface Petal {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  color: string;
  drift: number;
  type: 'petal' | 'gold-sparkle' | 'batik-leaf';
}

function createPetals(count: number, colors: string[], isJawa: boolean): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: isJawa ? (Math.random() * 6 + 3) : (Math.random() * 8 + 4),
    duration: Math.random() * 8 + 8,
    delay: Math.random() * 10,
    rotate: Math.random() * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
    drift: Math.random() * 60 - 30,
    type: isJawa
      ? (Math.random() > 0.5 ? 'gold-sparkle' : 'batik-leaf')
      : 'petal',
  }));
}

export function FlowerPetals() {
  const { adat, adatKey } = useInvitationTheme();
  const petalColors = adat.petalColors;
  const isJawa = adatKey === 'jawa';

  // Use useEffect to create petals only on client side to avoid hydration mismatch
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(createPetals(isJawa ? 15 : 20, petalColors, isJawa));
  }, [petalColors, isJawa]);

  if (petals.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: '-20px',
            width: petal.size,
            height: petal.size,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, petal.drift, petal.drift / 2, petal.drift],
            rotate: [petal.rotate, petal.rotate + 360],
            opacity: [0, 0.7, 0.7, 0.5, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {petal.type === 'gold-sparkle' ? (
            /* Gold sparkle — small diamond shape */
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%' }}
            >
              <path
                d="M10 0L12 7L20 10L12 13L10 20L8 13L0 10L8 7Z"
                fill={petal.color}
                opacity="0.9"
              />
            </svg>
          ) : petal.type === 'batik-leaf' ? (
            /* Batik leaf — kawung-inspired floating shape */
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%' }}
            >
              <circle cx="10" cy="10" r="4" fill={petal.color} opacity="0.6" />
              <circle cx="10" cy="5" r="2" fill={petal.color} opacity="0.3" />
              <circle cx="10" cy="15" r="2" fill={petal.color} opacity="0.3" />
              <circle cx="5" cy="10" r="2" fill={petal.color} opacity="0.3" />
              <circle cx="15" cy="10" r="2" fill={petal.color} opacity="0.3" />
            </svg>
          ) : (
            /* Original flower petal */
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%' }}
            >
              <ellipse
                cx="10"
                cy="10"
                rx="7"
                ry="4"
                fill={petal.color}
                opacity="0.8"
                transform="rotate(30 10 10)"
              />
              <ellipse
                cx="10"
                cy="10"
                rx="6"
                ry="3"
                fill={petal.color}
                opacity="0.5"
                transform="rotate(-20 10 10)"
              />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}
