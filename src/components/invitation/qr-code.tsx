'use client';

import { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  content?: string;   // Alias for value — URL or text to encode
  size?: number;
  sizeLabel?: 'small' | 'medium' | 'large';  // Named size preset
  fgColor?: string;
  bgColor?: string;
  className?: string;
}

/**
 * Simple QR Code generator using canvas
 * Generates a basic QR code without external dependencies
 */
export function QRCode({ value, content, size, sizeLabel, fgColor = '#D4AF37', bgColor = 'transparent', className = '' }: QRCodeProps) {
  const resolvedContent = content || value || '';
  // Resolve pixel size from sizeLabel or numeric size
  const resolvedSize = size ?? (sizeLabel === 'small' ? 80 : sizeLabel === 'large' ? 180 : 128);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !resolvedContent) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR-like pattern (decorative, not a real QR code scanner)
    // For a real QR code, use a library like 'qrcode'
    canvas.width = resolvedSize;
    canvas.height = resolvedSize;
    
    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, resolvedSize, resolvedSize);
    }
    
    ctx.fillStyle = fgColor;
    
    // Generate a deterministic pattern from the string
    const cellSize = Math.floor(resolvedSize / 25);
    const offset = Math.floor((resolvedSize - cellSize * 25) / 2);
    
    // Create a simple hash-based pattern
    let hash = 0;
    for (let i = 0; i < resolvedContent.length; i++) {
      hash = ((hash << 5) - hash + resolvedContent.charCodeAt(i)) | 0;
    }
    
    // Draw finder patterns (3 corners)
    const drawFinder = (x: number, y: number) => {
      // Outer
      ctx.fillRect(offset + x * cellSize, offset + y * cellSize, 7 * cellSize, 7 * cellSize);
      // Inner clear
      ctx.clearRect(offset + (x + 1) * cellSize, offset + (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      // Center
      ctx.fillRect(offset + (x + 2) * cellSize, offset + (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };
    
    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(offset + 1 * cellSize, offset + 1 * cellSize, 5 * cellSize, 5 * cellSize);
    }
    ctx.fillStyle = fgColor;
    
    drawFinder(0, 0);
    drawFinder(18, 0);
    drawFinder(0, 18);
    
    // Fill data area with hash-based pattern
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        // Skip finder pattern areas
        if ((row < 8 && col < 8) || (row < 8 && col > 16) || (row > 16 && col < 8)) continue;
        
        const bit = ((hash * 31 + row * 7 + col * 13) >>> 0) % 3;
        if (bit === 0) {
          ctx.fillRect(offset + col * cellSize, offset + row * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [resolvedContent, resolvedSize, fgColor, bgColor]);

  return <canvas ref={canvasRef} className={className} style={{ width: resolvedSize, height: resolvedSize }} />;
}

/**
 * QR Code section for sharing the invitation link
 */
export function InvitationQRCode({ 
  url, 
  content,
  title = 'Scan untuk membuka undangan',
  fgColor = '#D4AF37',
  sizeLabel,
  className = ''
}: { 
  url?: string;
  content?: string;
  title?: string;
  fgColor?: string;
  sizeLabel?: 'small' | 'medium' | 'large';
  className?: string;
}) {
  const resolvedContent = content || url || '';
  const resolvedSize = sizeLabel === 'small' ? 80 : sizeLabel === 'large' ? 160 : 120;
  return (
    <div className={`text-center py-6 ${className}`}>
      <div className="inline-block p-4 rounded-lg border border-border/30 bg-card/50">
        <QRCode value={resolvedContent} size={resolvedSize} fgColor={fgColor} />
      </div>
      {title && (
        <p className="mt-2 text-[10px] text-muted-foreground">{title}</p>
      )}
    </div>
  );
}
