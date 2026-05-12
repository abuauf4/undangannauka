'use client';

import { motion } from 'framer-motion';

interface AnimatedDividerProps {
  variant?: 'simple' | 'ornate' | 'floral';
}

export function AnimatedDivider({ variant = 'ornate' }: AnimatedDividerProps) {
  if (variant === 'simple') {
    return (
      <div className="flex items-center justify-center py-4">
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="h-px w-16 md:w-24"
            style={{ backgroundColor: 'var(--inv-accent)' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            style={{ fill: 'var(--inv-accent)' }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <path d="M4 0L5 3L8 4L5 5L4 8L3 5L0 4L3 3Z" />
          </motion.svg>
          <motion.div
            className="h-px w-16 md:w-24"
            style={{ backgroundColor: 'var(--inv-accent)' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </div>
    );
  }

  if (variant === 'floral') {
    return (
      <div className="flex items-center justify-center py-6">
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.6 }}
        >
          {/* Left floral line */}
          <motion.div
            className="flex items-center gap-1"
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-px w-8 md:w-12" style={{ backgroundColor: 'var(--inv-accent)' }} />
            <svg width="6" height="6" viewBox="0 0 6 6" style={{ fill: 'var(--inv-accent)', opacity: 0.5 }}>
              <circle cx="3" cy="3" r="2" />
            </svg>
            <div className="h-px w-12 md:w-20" style={{ backgroundColor: 'var(--inv-accent)' }} />
          </motion.div>

          {/* Center ornament */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 18 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" style={{ fill: 'var(--inv-accent)' }}>
              <path d="M12 0L14 8L22 8L16 13L18 22L12 17L6 22L8 13L2 8L10 8Z" opacity="0.7" />
              <circle cx="12" cy="11" r="3" fill="var(--inv-accent)" />
            </svg>
          </motion.div>

          {/* Right floral line */}
          <motion.div
            className="flex items-center gap-1"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-px w-12 md:w-20" style={{ backgroundColor: 'var(--inv-accent)' }} />
            <svg width="6" height="6" viewBox="0 0 6 6" style={{ fill: 'var(--inv-accent)', opacity: 0.5 }}>
              <circle cx="3" cy="3" r="2" />
            </svg>
            <div className="h-px w-8 md:w-12" style={{ backgroundColor: 'var(--inv-accent)' }} />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Default: ornate variant — the most decorative
  return (
    <div className="flex items-center justify-center py-5">
      <motion.div
        className="flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.5 }}
      >
        {/* Left expanding line */}
        <motion.div
          className="h-px"
          style={{
            width: '4rem',
            background: 'linear-gradient(to right, transparent, var(--inv-accent))',
          }}
          initial={{ scaleX: 0, originX: 1 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Left dot */}
        <motion.div
          className="mx-1.5 h-1 w-1 rounded-full"
          style={{ backgroundColor: 'var(--inv-accent)' }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 20 }}
        />

        {/* Left small line */}
        <motion.div
          className="h-px w-6"
          style={{ backgroundColor: 'var(--inv-accent)' }}
          initial={{ scaleX: 0, originX: 1 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Center diamond — animated scale with rotation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 18 }}
          className="mx-2"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" style={{ fill: 'var(--inv-accent)' }}>
            <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" />
          </svg>
        </motion.div>

        {/* Right small line */}
        <motion.div
          className="h-px w-6"
          style={{ backgroundColor: 'var(--inv-accent)' }}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Right dot */}
        <motion.div
          className="mx-1.5 h-1 w-1 rounded-full"
          style={{ backgroundColor: 'var(--inv-accent)' }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 20 }}
        />

        {/* Right expanding line */}
        <motion.div
          className="h-px"
          style={{
            width: '4rem',
            background: 'linear-gradient(to left, transparent, var(--inv-accent))',
          }}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </div>
  );
}
