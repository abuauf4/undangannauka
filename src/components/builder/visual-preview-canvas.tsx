'use client';

import { useRef, useEffect, useState } from 'react';
import {
  TemplateConfig,
  SectionKey,
  SECTION_LABELS,
  COMPONENT_REGISTRY,
} from '@/lib/template-builder-types';
import { ThemeGradient, getPaletteCSSVars, getDesignVariantClasses } from '@/lib/template-builder-helpers';
import { VisualSection } from './visual-section-renderer';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   VISUAL PREVIEW CANVAS v4 — TRUE WYSIWYG

   No phone bezel/frame — just the invitation at real size.
   Mobile 375px, Tablet 480px, Desktop 600px.
   Scrollable vertically like a real invitation.
   Auto-scroll to selected section.
   ═══════════════════════════════════════════════════════════════ */

export type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const VIEWPORT_CONFIG: Record<ViewportSize, { maxWidth: number; label: string; icon: React.ReactNode }> = {
  mobile: { maxWidth: 375, label: 'Mobile', icon: <Smartphone className="size-3" /> },
  tablet: { maxWidth: 480, label: 'Tablet', icon: <Tablet className="size-3" /> },
  desktop: { maxWidth: 600, label: 'Desktop', icon: <Monitor className="size-3" /> },
};

interface VisualPreviewCanvasProps {
  config: TemplateConfig;
  selectedSectionKey: SectionKey | null;
  selectedElementId: string | null;
  theme?: ThemeGradient;
  animationsPaused?: boolean;
  viewport?: ViewportSize;
  onSectionClick: (sectionKey: SectionKey) => void;
  onElementClick: (elementId: string) => void;
  onDropZoneClick: (sectionKey: SectionKey, position: string) => void;
  onTextElementClick?: (elementId: string) => void;
  onViewportChange?: (viewport: ViewportSize) => void;
}

export function VisualPreviewCanvas({
  config,
  selectedSectionKey,
  selectedElementId,
  theme,
  animationsPaused,
  viewport = 'mobile',
  onSectionClick,
  onElementClick,
  onDropZoneClick,
  onTextElementClick,
  onViewportChange,
}: VisualPreviewCanvasProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Auto-scroll to selected section
  useEffect(() => {
    if (selectedSectionKey && sectionRefs.current.has(selectedSectionKey)) {
      const el = sectionRefs.current.get(selectedSectionKey)!;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedSectionKey]);

  const enabledSections = config.sections.filter((s) => s.enabled);
  const paletteVars = getPaletteCSSVars(config.colorPalette);
  const dvClasses = getDesignVariantClasses(config.designVariant);

  const screenBg = theme?.bg || 'linear-gradient(180deg, #F5F0E6 0%, #EDE5D5 100%)';

  const vpConfig = VIEWPORT_CONFIG[viewport];

  return (
    <div className="flex flex-col h-full">
      {/* Viewport switcher + animation controls */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-border bg-card/50">
        <div className="flex items-center gap-0.5 bg-muted/50 rounded-lg p-0.5">
          {(Object.entries(VIEWPORT_CONFIG) as [ViewportSize, typeof VIEWPORT_CONFIG[ViewportSize]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => onViewportChange?.(key)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all ${
                viewport === key
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
              title={cfg.label}
            >
              {cfg.icon}
              <span className="hidden sm:inline">{cfg.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
          {animationsPaused && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500">
              Animasi Dijeda
            </span>
          )}
          <span>{enabledSections.length} seksi</span>
        </div>
      </div>

      {/* Canvas — the actual invitation scroll area */}
      <div className="relative flex-1 flex items-start justify-center overflow-hidden bg-muted/30">
        <div
          ref={scrollRef}
          className={`overflow-y-auto overflow-x-hidden relative ${dvClasses.fontBody}`}
          style={{
            background: screenBg,
            height: '100%',
            maxWidth: vpConfig.maxWidth,
            width: '100%',
            ...paletteVars,
          }}
        >
          {/* Render each section at full width */}
          {enabledSections.map((section, idx) => (
            <div
              key={section.key}
              ref={(el) => {
                if (el) sectionRefs.current.set(section.key, el);
              }}
              className={dvClasses.sectionPadding}
              style={{ borderBottom: idx < enabledSections.length - 1 ? `1px solid ${theme?.border || 'rgba(212,175,55,0.1)'}` : 'none' }}
            >
              <VisualSection
                section={section}
                isSelected={selectedSectionKey === section.key}
                selectedElementId={selectedElementId}
                theme={theme}
                animationsPaused={animationsPaused}
                designVariant={config.designVariant}
                onClick={() => onSectionClick(section.key)}
                onElementClick={onElementClick}
                onDropZoneClick={(position) => onDropZoneClick(section.key, position)}
                onTextElementClick={onTextElementClick}
              />
            </div>
          ))}

          {/* Empty state */}
          {enabledSections.length === 0 && (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
              Tidak ada seksi yang aktif
            </div>
          )}
        </div>
      </div>

      {/* Section navigation strip */}
      <div className="border-t border-border bg-card/30 px-2 py-1.5">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[8px] text-muted-foreground">Navigasi Seksi</span>
          <span className="text-[7px] text-muted-foreground/60">
            {enabledSections.reduce((acc, s) => acc + s.elements.length, 0)} elemen
          </span>
        </div>
        <div className="flex gap-0.5 overflow-x-auto pb-0.5 scrollbar-thin">
          {enabledSections.map((section) => {
            const isSelected = selectedSectionKey === section.key;
            const animCount = section.elements.filter(e => e.animation !== 'none').length;
            return (
              <button
                key={section.key}
                className={`flex-shrink-0 rounded px-1.5 py-0.5 cursor-pointer transition-all text-left ${
                  isSelected ? 'bg-amber-600/20 border border-amber-600/40' : 'bg-muted/30 border border-transparent hover:bg-muted/50'
                }`}
                onClick={() => onSectionClick(section.key)}
                title={`${SECTION_LABELS[section.key]}: ${animCount} animasi`}
              >
                <div className="text-[7px] font-medium truncate max-w-[60px]" style={{ color: isSelected ? (theme?.accent || '#D4AF37') : undefined }}>
                  {SECTION_LABELS[section.key]}
                </div>
                <div className="flex gap-px mt-0.5">
                  {section.elements.slice(0, 6).map((el, i) => {
                    const info = COMPONENT_REGISTRY.find(c => c.type === el.component);
                    const colorMap: Record<string, string> = { wayang: '#D97706', batik: '#6366F1', ornament: '#10B981', atmosphere: '#0EA5E9', frame: '#8B5CF6' };
                    const hasAnim = el.animation !== 'none';
                    return (
                      <div key={i} className="h-1 rounded-full"
                        style={{
                          width: Math.max(4, Math.min(20, el.duration * 2)),
                          backgroundColor: colorMap[info?.category || 'ornament'],
                          opacity: hasAnim ? 0.8 : 0.3,
                        }} />
                    );
                  })}
                  {section.elements.length > 6 && (
                    <span className="text-[6px] text-muted-foreground ml-0.5">+{section.elements.length - 6}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
