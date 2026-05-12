'use client';

import { motion } from 'framer-motion';
import { Film, Play } from 'lucide-react';
import { useState } from 'react';

interface VideoEmbedProps {
  videoUrl?: string;
  url?: string;
  title?: string;
  autoplay?: boolean;
  className?: string;
}

/**
 * Video embed component for welcome video
 * Supports YouTube, Vimeo, and direct video URLs
 */
export function VideoEmbed({ videoUrl, url, title = 'Video', autoplay = false, className = '' }: VideoEmbedProps) {
  const resolvedUrl = url || videoUrl || '';
  const [isPlaying, setIsPlaying] = useState(autoplay);

  // Detect video type
  const getVideoInfo = (rawUrl: string) => {
    // YouTube
    const ytMatch = rawUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
    if (ytMatch) {
      return { type: 'youtube' as const, id: ytMatch[1], embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0` };
    }
    // Vimeo
    const vmMatch = rawUrl.match(/vimeo\.com\/(?:video\/)?([\w-]+)/);
    if (vmMatch) {
      return { type: 'vimeo' as const, id: vmMatch[1], embedUrl: `https://player.vimeo.com/video/${vmMatch[1]}?autoplay=1` };
    }
    // Direct URL
    return { type: 'direct' as const, id: '', embedUrl: rawUrl };
  };

  if (!resolvedUrl) return null;

  const videoInfo = getVideoInfo(resolvedUrl);

  return (
    <motion.div
      className={`py-6 px-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-md mx-auto">
        {title && (
          <div className="text-center mb-4">
            <Film className="size-5 mx-auto mb-2" style={{ color: 'var(--inv-accent)' }} />
            <h3 className="font-serif text-lg" style={{ color: 'var(--inv-text)', fontFamily: 'var(--font-playfair)' }}>
              {title}
            </h3>
          </div>
        )}

        <div className="relative rounded-xl overflow-hidden border-2" style={{ borderColor: 'var(--inv-accent-soft)', aspectRatio: '16/9' }}>
          {!isPlaying ? (
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20"
              onClick={() => setIsPlaying(true)}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                style={{ backgroundColor: 'var(--inv-accent)' }}
              >
                <Play className="size-7 text-white ml-1" />
              </div>
            </div>
          ) : null}

          {isPlaying ? (
            videoInfo.type === 'direct' ? (
              <video
                src={videoInfo.embedUrl}
                autoPlay
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                src={videoInfo.embedUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                frameBorder="0"
              />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[var(--inv-bg-pattern)] to-[var(--inv-bg)]" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
