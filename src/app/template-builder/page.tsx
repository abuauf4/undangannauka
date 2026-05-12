'use client';

import { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Save, Eye, EyeOff, Plus, Trash2, ChevronDown, ChevronRight,
  GripVertical, X, Copy, Sparkles, Wand2, Loader2, Palette,
  Undo2, Redo2, Play, Pause, RotateCcw, Clock, Zap, Download, Upload,
  Music, Film, Settings2, Type, Globe, Image as ImageIcon,
  MoreVertical, Minus, PlusCircle, ImagePlus, Layers, Move, Smartphone, Tablet, Monitor,
} from 'lucide-react';
import Link from 'next/link';
import { authFetch } from '@/lib/api-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  TemplateConfig, TemplateElement, ComponentInfo, PositionType, AnimationType,
  SizeType, SectionKey, ComponentType, COMPONENT_REGISTRY, SECTION_LABELS,
  POSITION_LABELS, ANIMATION_LABELS, SIZE_LABELS, CATEGORY_LABELS,
  SECTION_PROPERTY_SUGGESTIONS, generateElementId, createEmptyConfig,
  DESIGN_VARIANTS, JAVANESE_COLOR_PALETTES, OPENING_ANIMATION_OPTIONS,
  MUSIC_PRESETS, isSectionVisible, DesignVariant, ColorPalettePreset,
  OpeningAnimationType, SectionBackground, BackgroundType, PatternType,
} from '@/lib/template-builder-types';
import { uploadImage } from '@/lib/upload-helper';
import {
  HistoryManager, getThemeWithPalette, getPaletteCSSVars,
  SECTION_PRESETS, applyPreset, applyPresetReplace, reorderSections,
  saveDraft, loadDraft, loadDraftMeta, clearDraft, DraftData, DraftMeta,
  exportConfigJson, importConfigJson,
} from '@/lib/template-builder-helpers';
import { VisualPreviewCanvas, ViewportSize } from '@/components/builder/visual-preview-canvas';

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE BUILDER v4 — Three-Panel TRUE WYSIWYG Layout

   Left Panel (280px): Section management + settings
   Center (flex-1): Full-size invitation canvas
   Right Panel (320px): Element properties
   ═══════════════════════════════════════════════════════════════ */

// ─── Element Properties Panel (Right Side) ───
function ElementPropertiesPanel({ element, onChange, onRemove, onDuplicate, autoFocusText }: {
  element: TemplateElement; onChange: (updates: Partial<TemplateElement>) => void;
  onRemove: () => void; onDuplicate: () => void; autoFocusText?: boolean;
}) {
  const info = COMPONENT_REGISTRY.find(c => c.type === element.component);
  const textRef = useRef<HTMLInputElement>(null);
  const [reUploading, setReUploading] = useState(false);

  useEffect(() => { if (autoFocusText && textRef.current) { textRef.current.focus(); textRef.current.select(); } }, [autoFocusText]);

  const isCustomImage = element.component === 'CustomUploadedImage';

  const handleReUpload = useCallback(async () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
      setReUploading(true);
      try { const url = await uploadImage(file, `custom-${Date.now()}`); onChange({ props: { ...element.props, imageUrl: url } }); toast.success('Gambar berhasil di-upload'); }
      catch { toast.error('Gagal meng-upload gambar'); } finally { setReUploading(false); }
    }; input.click();
  }, [element.props, onChange]);

  return (
    <div className="space-y-3 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{info?.icon}</span>
          <div>
            <span className="font-medium text-sm block">{info?.label}</span>
            <span className="text-[10px] text-muted-foreground">{info?.description}</span>
          </div>
        </div>
        <button onClick={onRemove} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400" title="Hapus"><Trash2 className="size-3.5" /></button>
      </div>

      {/* Custom image upload */}
      {isCustomImage && (
        <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
          {element.props?.imageUrl ? (
            <div className="space-y-2">
              <div className="rounded-lg overflow-hidden border bg-muted/20">
                <img src={element.props.imageUrl} alt={element.props?.label || 'Custom'} className="w-full h-auto max-h-32 object-contain" />
              </div>
              <button onClick={handleReUpload} disabled={reUploading} className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border text-xs hover:bg-muted disabled:opacity-50">
                {reUploading ? <Loader2 className="size-3 animate-spin" /> : <Upload className="size-3" />}
                {reUploading ? 'Mengupload...' : 'Ganti Gambar'}
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-amber-600/50 hover:bg-amber-600/5 transition-all" onClick={handleReUpload}>
              <Upload className="size-6 mx-auto mb-1 opacity-40" />
              <div className="text-xs opacity-50">Klik untuk upload</div>
            </div>
          )}
          <input type="text" value={element.props?.imageUrl || ''} onChange={(e) => onChange({ props: { ...element.props, imageUrl: e.target.value } })}
            placeholder="URL gambar" className="w-full bg-background border border-border rounded-md px-2 py-1 text-xs" />
          <input type="text" value={element.props?.label || ''} onChange={(e) => onChange({ props: { ...element.props, label: e.target.value } })}
            placeholder="Label" className="w-full bg-background border border-border rounded-md px-2 py-1 text-xs" />
        </div>
      )}

      {/* Position picker 3x3 */}
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">Posisi</label>
        <div className="grid grid-cols-3 gap-1 p-2 bg-muted/30 rounded-lg border border-border">
          <div />
          <button onClick={() => onChange({ position: 'above' })} className={`p-1.5 rounded text-[9px] text-center transition-all ${element.position === 'above' ? 'bg-amber-600 text-white shadow-sm' : 'bg-muted/50 hover:bg-muted border border-border/50'}`}>Atas</button>
          <div />
          <button onClick={() => onChange({ position: 'flank-left' })} className={`p-1.5 rounded text-[9px] text-center transition-all ${element.position === 'flank-left' || element.position === 'left' ? 'bg-amber-600 text-white shadow-sm' : 'bg-muted/50 hover:bg-muted border border-border/50'}`}>Kiri</button>
          <button onClick={() => onChange({ position: 'center' })} className={`p-1.5 rounded text-[9px] text-center transition-all ${element.position === 'center' ? 'bg-amber-600 text-white shadow-sm' : 'bg-muted/50 hover:bg-muted border border-border/50'}`}>Tengah</button>
          <button onClick={() => onChange({ position: 'flank-right' })} className={`p-1.5 rounded text-[9px] text-center transition-all ${element.position === 'flank-right' || element.position === 'right' ? 'bg-amber-600 text-white shadow-sm' : 'bg-muted/50 hover:bg-muted border border-border/50'}`}>Kanan</button>
          <div />
          <button onClick={() => onChange({ position: 'below' })} className={`p-1.5 rounded text-[9px] text-center transition-all ${element.position === 'below' ? 'bg-amber-600 text-white shadow-sm' : 'bg-muted/50 hover:bg-muted border border-border/50'}`}>Bawah</button>
          <button onClick={() => onChange({ position: 'background' })} className={`p-1.5 rounded text-[9px] text-center transition-all ${element.position === 'background' ? 'bg-amber-600 text-white shadow-sm' : 'bg-muted/50 hover:bg-muted border border-border/50'}`}>BG</button>
        </div>
      </div>

      {/* Animation */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Animasi</label>
        <select value={element.animation} onChange={(e) => onChange({ animation: e.target.value as AnimationType })} className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-xs">
          {Object.entries(ANIMATION_LABELS).map(([val, label]) => (<option key={val} value={val}>{label}</option>))}
        </select>
      </div>

      {/* Duration */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 flex justify-between"><span>Durasi</span><span className="text-[10px] opacity-70">{element.duration}s</span></label>
        <input type="range" min={0.5} max={20} step={0.5} value={element.duration} onChange={(e) => onChange({ duration: parseFloat(e.target.value) })} className="w-full accent-amber-600" />
      </div>

      {/* Delay */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 flex justify-between"><span>Delay</span><span className="text-[10px] opacity-70">{element.delay}s</span></label>
        <input type="range" min={0} max={5} step={0.1} value={element.delay} onChange={(e) => onChange({ delay: parseFloat(e.target.value) })} className="w-full accent-amber-600" />
      </div>

      {/* Size */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Ukuran</label>
        <div className="flex gap-1">
          {(['small', 'medium', 'large', 'full'] as SizeType[]).map((size) => (
            <button key={size} onClick={() => onChange({ size })} className={`flex-1 px-2 py-1.5 text-[10px] rounded-md border transition-all ${element.size === size ? 'bg-amber-600 text-white border-amber-600' : 'bg-background border-border hover:border-amber-600/50'}`}>{SIZE_LABELS[size]}</button>
          ))}
        </div>
      </div>

      {/* Opacity */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 flex justify-between"><span>Transparansi</span><span className="text-[10px] opacity-70">{Math.round(element.opacity * 100)}%</span></label>
        <input type="range" min={0.05} max={1} step={0.05} value={element.opacity} onChange={(e) => onChange({ opacity: parseFloat(e.target.value) })} className="w-full accent-amber-600" />
      </div>

      {/* X Offset */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 flex justify-between"><span>X Offset</span><span className="text-[10px] opacity-70">{element.xOffset || 0}%</span></label>
        <input type="range" min={-100} max={100} step={5} value={element.xOffset || 0} onChange={(e) => onChange({ xOffset: parseInt(e.target.value) })} className="w-full accent-amber-600" />
      </div>

      {/* Y Offset */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 flex justify-between"><span>Y Offset</span><span className="text-[10px] opacity-70">{element.yOffset || 0}%</span></label>
        <input type="range" min={-100} max={100} step={5} value={element.yOffset || 0} onChange={(e) => onChange({ yOffset: parseInt(e.target.value) })} className="w-full accent-amber-600" />
      </div>

      {/* Custom width */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 flex justify-between"><span>Lebar Kustom</span><span className="text-[10px] opacity-70">{element.props?.width ? `${element.props.width}%` : 'auto'}</span></label>
        <input type="range" min={20} max={100} step={5} value={element.props?.width || 100} onChange={(e) => onChange({ props: { ...element.props, width: parseInt(e.target.value) } })} className="w-full accent-amber-600" />
      </div>

      {/* Component-specific props */}
      {info?.hasProps && info.defaultProps && !isCustomImage && (
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Properti</label>
          {Object.entries(info.defaultProps).map(([key, defaultValue]) => (
            <div key={key} className="mb-1">
              <label className="text-[10px] text-muted-foreground/70 block mb-0.5">{key}</label>
              <input ref={key === 'text' ? textRef : undefined} type="text" value={element.props?.[key] ?? String(defaultValue)}
                onChange={(e) => onChange({ props: { ...element.props, [key]: e.target.value } })}
                className="w-full bg-background border border-border rounded-md px-2 py-1 text-xs" />
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <button onClick={onDuplicate} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs hover:bg-muted"><Copy className="size-3" />Duplikasi</button>
        <button onClick={onRemove} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10"><Trash2 className="size-3" />Hapus</button>
      </div>
    </div>
  );
}

// ─── Component Picker Modal ───
function ComponentPickerModal({ onSelect, onClose, sectionKey, preferredPosition }: {
  onSelect: (component: ComponentInfo, extraProps?: Record<string, any>) => void; onClose: () => void;
  sectionKey: SectionKey; preferredPosition?: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { key: 'all', label: 'Semua', icon: '✨' },
    ...Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label, icon: { wayang: '🎭', batik: '🧵', ornament: '🏛️', atmosphere: '☁️', frame: '🖼️' }[key] || '📦' })),
  ];

  const suggestedTypes = SECTION_PROPERTY_SUGGESTIONS[sectionKey] || [];
  const suggestedComponents = suggestedTypes.map(type => COMPONENT_REGISTRY.find(c => c.type === type)).filter(Boolean) as ComponentInfo[];
  const filtered = activeCategory === 'all' ? COMPONENT_REGISTRY : COMPONENT_REGISTRY.filter(c => c.category === activeCategory);
  const nonSuggestedFiltered = filtered.filter(c => !suggestedTypes.includes(c.type));

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, `custom-prop-${Date.now()}`);
      const customComp = COMPONENT_REGISTRY.find(c => c.type === 'CustomUploadedImage');
      if (customComp) onSelect(customComp, { imageUrl: url, label: customLabel || file.name.replace(/\.[^.]+$/, '') });
    } catch { toast.error('Gagal meng-upload gambar'); }
    finally { setUploading(false); setShowUploadPanel(false); }
  }, [customLabel, onSelect]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-lg mx-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <h3 className="font-medium text-sm">Tambah Properti</h3>
            <p className="text-[10px] text-muted-foreground">Seksi: {SECTION_LABELS[sectionKey]}{preferredPosition ? ` → ${POSITION_LABELS[preferredPosition as PositionType] || preferredPosition}` : ''}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="size-4" /></button>
        </div>

        {/* Upload button */}
        <div className="px-4 py-2 border-b border-border">
          <button onClick={() => setShowUploadPanel(!showUploadPanel)} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-amber-600/30 text-amber-600 hover:bg-amber-600/5 text-xs">
            <Upload className="size-4" />Upload Gambar Custom
          </button>
        </div>

        <AnimatePresence>
          {showUploadPanel && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-border">
              <div className="p-4 space-y-3">
                <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-amber-600/50" onClick={() => fileInputRef.current?.click()}>
                  {uploading ? <Loader2 className="size-8 animate-spin text-amber-600 mx-auto" /> : <><Upload className="size-8 mx-auto mb-2 opacity-40" /><div className="text-xs opacity-50">Klik untuk pilih file</div></>}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
                </div>
                <div className="flex items-center gap-2"><div className="h-px flex-1 bg-border" /><span className="text-[9px] text-muted-foreground">ATAU</span><div className="h-px flex-1 bg-border" /></div>
                <div className="space-y-2">
                  <input type="text" value={customUrl} onChange={e => setCustomUrl(e.target.value)} placeholder="URL gambar (https://...)" className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-xs" />
                  <input type="text" value={customLabel} onChange={e => setCustomLabel(e.target.value)} placeholder="Label (opsional)" className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-xs" />
                  <button onClick={() => { if (customUrl.trim()) { const c = COMPONENT_REGISTRY.find(c2 => c2.type === 'CustomUploadedImage'); if (c) onSelect(c, { imageUrl: customUrl.trim(), label: customLabel || 'Custom Image' }); setShowUploadPanel(false); } }}
                    disabled={!customUrl.trim()} className="w-full px-3 py-1.5 rounded-md bg-amber-600 text-white text-xs font-medium hover:bg-amber-600/90 disabled:opacity-50">Tambahkan</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-1 px-4 py-2 border-b border-border overflow-x-auto">
          {categories.map(cat => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-all ${activeCategory === cat.key ? 'bg-amber-600 text-white' : 'bg-muted/50 hover:bg-muted'}`}>
              <span>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeCategory === 'all' && suggestedComponents.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2"><span className="text-sm">💡</span><span className="text-xs font-medium text-amber-600">Direkomendasikan</span><span className="text-[9px] text-muted-foreground">untuk {SECTION_LABELS[sectionKey]}</span></div>
              <div className="grid grid-cols-1 gap-1.5">
                {suggestedComponents.map(comp => (
                  <button key={comp.type} onClick={() => onSelect(comp)} className="flex items-center gap-3 p-2.5 rounded-lg border border-amber-600/20 hover:border-amber-600/50 hover:bg-amber-600/5 text-left group">
                    <div className="w-10 h-10 rounded-lg bg-[#F5F0E6] border border-[#2C1810]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"><span className="text-lg">{comp.icon}</span></div>
                    <div className="flex-1 min-w-0"><p className="font-medium text-xs">{comp.label}</p><p className="text-[9px] text-muted-foreground truncate">{comp.description}</p></div>
                    <Plus className="size-3.5 text-muted-foreground group-hover:text-amber-600 flex-shrink-0" />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 mb-1"><div className="h-px flex-1 bg-border" /><span className="text-[9px] text-muted-foreground">Semua</span><div className="h-px flex-1 bg-border" /></div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-2">
            {(activeCategory === 'all' ? nonSuggestedFiltered : filtered).map(comp => (
              <button key={comp.type} onClick={() => onSelect(comp)} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-amber-600/50 hover:bg-amber-600/5 text-left group">
                <div className="w-12 h-12 rounded-lg bg-[#F5F0E6] border border-[#2C1810]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"><span className="text-xl">{comp.icon}</span></div>
                <div className="flex-1 min-w-0"><p className="font-medium text-sm">{comp.label}</p><p className="text-[10px] text-muted-foreground truncate">{comp.description}</p></div>
                <Plus className="size-4 text-muted-foreground group-hover:text-amber-600 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Preset Picker Modal ───
function PresetPickerModal({ onApply, onClose, sectionKey }: {
  onApply: (preset: typeof SECTION_PRESETS[0], replace: boolean) => void; onClose: () => void; sectionKey: SectionKey | null;
}) {
  const filtered = sectionKey ? SECTION_PRESETS.filter(p => p.targetSection === sectionKey) : SECTION_PRESETS;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-lg mx-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div><h3 className="font-medium text-sm flex items-center gap-2"><Zap className="size-4 text-amber-600" />Preset Seksi</h3>
            <p className="text-[10px] text-muted-foreground">{sectionKey ? `Untuk: ${SECTION_LABELS[sectionKey]}` : 'Pilih preset'}</p></div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="size-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">Pilih seksi terlebih dahulu</div>}
          {filtered.map(preset => (
            <div key={preset.id} className="p-3 rounded-lg border border-border hover:border-amber-600/40">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#2C1810] flex items-center justify-center flex-shrink-0"><span className="text-2xl">{preset.icon}</span></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{preset.name}</p><p className="text-[10px] text-muted-foreground mb-2">{preset.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {preset.elements.map((el, i) => { const info = COMPONENT_REGISTRY.find(c => c.type === el.component); return (<span key={i} className="text-[8px] px-1.5 py-0.5 rounded-full bg-muted/50 border border-border/50">{info?.icon} {info?.label}</span>); })}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onApply(preset, false)} className="flex items-center gap-1 px-3 py-1 rounded-md text-[10px] bg-amber-600/10 text-amber-600 border border-amber-600/30 hover:bg-amber-600/20"><Plus className="size-3" />Tambahkan</button>
                    <button onClick={() => onApply(preset, true)} className="flex items-center gap-1 px-3 py-1 rounded-md text-[10px] bg-muted/50 border border-border hover:bg-muted"><RotateCcw className="size-3" />Ganti Semua</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Section Background Settings ───
function SectionBackgroundSettings({ background, theme, onChange }: {
  background?: SectionBackground; theme: any; onChange: (bg: SectionBackground) => void;
}) {
  const bg: SectionBackground = background || { type: 'solid' };
  return (
    <div className="space-y-2">
      <label className="text-[10px] text-muted-foreground block">Background</label>
      <div className="flex gap-1">
        {(['solid', 'pattern', 'photo', 'gradient'] as BackgroundType[]).map(type => (
          <button key={type} onClick={() => onChange({ ...bg, type })}
            className={`flex-1 px-1.5 py-1 text-[8px] rounded-md border transition-all ${bg.type === type ? 'bg-amber-600 text-white border-amber-600' : 'bg-muted/50 border-border hover:border-amber-600/50'}`}>
            {type === 'solid' ? 'Solid' : type === 'pattern' ? 'Corak' : type === 'photo' ? 'Foto' : 'Gradient'}
          </button>
        ))}
      </div>
      {bg.type === 'solid' && (
        <div className="flex items-center gap-2">
          <input type="color" value={bg.color || '#2C1810'} onChange={e => onChange({ ...bg, color: e.target.value })} className="w-8 h-8 rounded border border-border cursor-pointer" />
          <span className="text-[9px] text-muted-foreground">{bg.color || theme.sectionBg}</span>
        </div>
      )}
      {bg.type === 'pattern' && (
        <div className="space-y-2">
          <select value={bg.pattern || 'none'} onChange={e => onChange({ ...bg, pattern: e.target.value as PatternType })} className="w-full bg-background border border-border rounded-md px-2 py-1 text-xs">
            <option value="none">Tanpa Corak</option><option value="parang">Parang</option><option value="truntum">Truntum</option><option value="kawung">Kawung</option>
          </select>
          <div><label className="text-[9px] text-muted-foreground flex justify-between"><span>Opacity Corak</span><span>{Math.round((bg.patternOpacity ?? 0.1) * 100)}%</span></label>
            <input type="range" min={0.02} max={0.5} step={0.02} value={bg.patternOpacity ?? 0.1} onChange={e => onChange({ ...bg, patternOpacity: parseFloat(e.target.value) })} className="w-full accent-amber-600" /></div>
        </div>
      )}
      {bg.type === 'photo' && (
        <div className="space-y-2">
          <input type="text" value={bg.photoUrl || ''} onChange={e => onChange({ ...bg, photoUrl: e.target.value })} placeholder="URL foto" className="w-full bg-background border border-border rounded-md px-2 py-1 text-xs" />
          <div><label className="text-[9px] text-muted-foreground flex justify-between"><span>Opacity Foto</span><span>{Math.round((bg.photoOpacity ?? 0.3) * 100)}%</span></label>
            <input type="range" min={0.05} max={1} step={0.05} value={bg.photoOpacity ?? 0.3} onChange={e => onChange({ ...bg, photoOpacity: parseFloat(e.target.value) })} className="w-full accent-amber-600" /></div>
        </div>
      )}
      {bg.type === 'gradient' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1"><label className="text-[9px] text-muted-foreground block">From</label><input type="color" value={bg.gradientFrom || '#800020'} onChange={e => onChange({ ...bg, gradientFrom: e.target.value })} className="w-full h-7 rounded border cursor-pointer" /></div>
            <div className="flex-1"><label className="text-[9px] text-muted-foreground block">To</label><input type="color" value={bg.gradientTo || '#D4AF37'} onChange={e => onChange({ ...bg, gradientTo: e.target.value })} className="w-full h-7 rounded border cursor-pointer" /></div>
          </div>
          <select value={bg.gradientDirection || 'to-b'} onChange={e => onChange({ ...bg, gradientDirection: e.target.value as any })} className="w-full bg-background border border-border rounded-md px-2 py-1 text-xs">
            <option value="to-b">Ke Bawah</option><option value="to-br">Diagonal</option><option value="to-r">Ke Kanan</option><option value="radial">Radial</option>
          </select>
        </div>
      )}
    </div>
  );
}

// ─── Main Builder Content ───
function VisualTemplateBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  // State
  const [templateName, setTemplateName] = useState('Template Baru');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateAdat, setTemplateAdat] = useState('jawa');
  const [templateNuansa, setTemplateNuansa] = useState('islam');
  const [templateDesign, setTemplateDesign] = useState<string>('mewah');
  const [config, setConfig] = useState<TemplateConfig>(createEmptyConfig());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedSectionKey, setSelectedSectionKey] = useState<SectionKey | null>(null);
  const [pickerSectionKey, setPickerSectionKey] = useState<SectionKey | null>(null);
  const [pickerPosition, setPickerPosition] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!editId);
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [animationsPaused, setAnimationsPaused] = useState(false);
  const [viewport, setViewport] = useState<ViewportSize>('mobile');
  const [autoFocusTextElementId, setAutoFocusTextElementId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<SectionKey | null>('hero');

  // History
  const historyRef = useRef<HistoryManager | null>(null);
  const isUndoRedoRef = useRef(false);

  useEffect(() => { historyRef.current = new HistoryManager({ config: createEmptyConfig(), selectedElementId: null, selectedSectionKey: null }); }, []);

  const pushHistory = useCallback(() => {
    if (isUndoRedoRef.current) return;
    if (historyRef.current) historyRef.current.push({ config, selectedElementId, selectedSectionKey });
  }, [config, selectedElementId, selectedSectionKey]);

  const handleUndo = useCallback(() => {
    if (!historyRef.current) return;
    const state = historyRef.current.undo();
    if (state) { isUndoRedoRef.current = true; setConfig(state.config); setSelectedElementId(state.selectedElementId); setSelectedSectionKey(state.selectedSectionKey); isUndoRedoRef.current = false; toast.success('Undo'); }
  }, []);

  const handleRedo = useCallback(() => {
    if (!historyRef.current) return;
    const state = historyRef.current.redo();
    if (state) { isUndoRedoRef.current = true; setConfig(state.config); setSelectedElementId(state.selectedElementId); setSelectedSectionKey(state.selectedSectionKey); isUndoRedoRef.current = false; toast.success('Redo'); }
  }, []);

  const canUndo = historyRef.current?.canUndo || false;
  const canRedo = historyRef.current?.canRedo || false;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo(); }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); handleRedo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); handleSave(); }
      if (e.key === 'Delete' && selectedElementId) { removeElement(selectedElementId); }
      if (e.key === 'Escape') { setSelectedElementId(null); setPickerSectionKey(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleUndo, handleRedo, selectedElementId]);

  // Auto-save
  const [draftMeta, setDraftMeta] = useState<DraftMeta | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!editId) { const draft = loadDraft(); if (draft) { setTemplateName(draft.templateName); setTemplateDescription(draft.templateDescription); setTemplateAdat(draft.templateAdat); setTemplateNuansa(draft.templateNuansa); setTemplateDesign(draft.templateDesign); setConfig(draft.config); setDraftMeta(loadDraftMeta()); toast.success('Draft dimuat'); } }
  }, [editId]);

  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => { saveDraft({ templateName, templateDescription, templateAdat, templateNuansa, templateDesign, config }); setDraftMeta(loadDraftMeta()); }, 3000);
    return () => { if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current); };
  }, [config, templateName, templateDescription, templateAdat, templateNuansa, templateDesign]);

  // Theme
  const theme = getThemeWithPalette(templateNuansa, templateAdat, config.colorPalette, config.designVariant as any);

  // Load existing
  useEffect(() => { if (editId) loadTemplate(editId); }, [editId]);

  async function loadTemplate(id: string) {
    try {
      const res = await authFetch(`/api/template/${id}`);
      if (res.ok) { const data = await res.json(); const t = data.template; setTemplateName(t.name); setTemplateDescription(t.description || ''); setTemplateAdat(t.adat); setTemplateNuansa(t.nuansa); setTemplateDesign(t.design); if (t.config) setConfig(t.config as TemplateConfig); }
    } catch {} finally { setLoading(false); }
  }

  // Config update
  const updateConfig = useCallback((updater: (prev: TemplateConfig) => TemplateConfig) => { setConfig(prev => updater(prev)); }, []);

  const toggleSectionEnabled = useCallback((sectionKey: SectionKey) => {
    pushHistory();
    updateConfig(prev => ({ ...prev, sections: prev.sections.map(s => s.key === sectionKey ? { ...s, enabled: !s.enabled } : s) }));
  }, [updateConfig, pushHistory]);

  const updateSectionProps = useCallback((sectionKey: SectionKey, updates: Record<string, any>) => {
    pushHistory();
    updateConfig(prev => ({ ...prev, sections: prev.sections.map(s => s.key === sectionKey ? { ...s, ...updates } : s) }));
  }, [updateConfig, pushHistory]);

  const addElement = useCallback((sectionKey: SectionKey, componentInfo: ComponentInfo, position?: PositionType, extraProps?: Record<string, any>) => {
    pushHistory();
    const baseProps = componentInfo.hasProps && componentInfo.defaultProps ? { ...componentInfo.defaultProps } : {};
    const mergedProps = extraProps ? { ...baseProps, ...extraProps } : baseProps;
    const newElement: TemplateElement = {
      id: generateElementId(), component: componentInfo.type, position: position || componentInfo.defaultPosition,
      animation: componentInfo.defaultAnimation, duration: componentInfo.defaultDuration, delay: 0,
      size: componentInfo.defaultSize, opacity: componentInfo.defaultOpacity,
      ...(Object.keys(mergedProps).length > 0 ? { props: mergedProps } : {}),
    };
    updateConfig(prev => ({ ...prev, sections: prev.sections.map(s => s.key === sectionKey ? { ...s, elements: [...s.elements, newElement] } : s) }));
    setSelectedElementId(newElement.id); setSelectedSectionKey(sectionKey); setPickerSectionKey(null); setPickerPosition(undefined);
    toast.success(`${componentInfo.label} ditambahkan`);
  }, [updateConfig, pushHistory]);

  const updateElement = useCallback((elementId: string, updates: Partial<TemplateElement>) => {
    updateConfig(prev => ({ ...prev, sections: prev.sections.map(s => ({ ...s, elements: s.elements.map(el => el.id === elementId ? { ...el, ...updates } : el) })) }));
  }, [updateConfig]);

  const removeElement = useCallback((elementId: string) => {
    pushHistory();
    updateConfig(prev => ({ ...prev, sections: prev.sections.map(s => ({ ...s, elements: s.elements.filter(el => el.id !== elementId) })) }));
    if (selectedElementId === elementId) setSelectedElementId(null);
    toast.success('Elemen dihapus');
  }, [updateConfig, pushHistory, selectedElementId]);

  const duplicateElement = useCallback((sectionKey: SectionKey, elementId: string) => {
    pushHistory();
    updateConfig(prev => {
      const section = prev.sections.find(s => s.key === sectionKey); if (!section) return prev;
      const element = section.elements.find(e => e.id === elementId); if (!element) return prev;
      const newElement = { ...element, id: generateElementId() };
      return { ...prev, sections: prev.sections.map(s => s.key === sectionKey ? { ...s, elements: [...s.elements, newElement] } : s) };
    });
    toast.success('Elemen diduplikasi');
  }, [updateConfig, pushHistory]);

  // Drag & Drop reorder
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDrop = useCallback((toIndex: number) => {
    if (dragIndex !== null && dragIndex !== toIndex) { pushHistory(); setConfig(prev => reorderSections(prev, dragIndex, toIndex)); toast.success('Urutan diubah'); }
    setDragIndex(null); setDragOverIndex(null);
  }, [dragIndex, pushHistory]);

  // Handlers
  const handleDropZoneClick = useCallback((sectionKey: SectionKey, position: string) => { setPickerSectionKey(sectionKey); setPickerPosition(position); setSelectedSectionKey(sectionKey); }, []);
  const handleSectionClick = useCallback((sectionKey: SectionKey) => { setSelectedSectionKey(sectionKey); setExpandedSection(sectionKey); }, []);
  const handleElementClick = useCallback((elementId: string) => {
    setSelectedElementId(elementId);
    const section = config.sections.find(s => s.elements.some(el => el.id === elementId));
    if (section) { setSelectedSectionKey(section.key); setExpandedSection(section.key); }
  }, [config.sections]);

  const handleTextElementClick = useCallback((elementId: string) => {
    setSelectedElementId(elementId); setAutoFocusTextElementId(elementId);
    const section = config.sections.find(s => s.elements.some(el => el.id === elementId));
    if (section) { setSelectedSectionKey(section.key); setExpandedSection(section.key); }
    setTimeout(() => setAutoFocusTextElementId(null), 500);
  }, [config.sections]);

  const handleApplyPreset = useCallback((preset: typeof SECTION_PRESETS[0], replace: boolean) => {
    pushHistory(); setConfig(prev => replace ? applyPresetReplace(prev, preset) : applyPreset(prev, preset));
    setSelectedSectionKey(preset.targetSection); setShowPresetPicker(false);
    toast.success(`Preset "${preset.name}" ${replace ? 'mengganti' : 'ditambahkan'}`);
  }, [pushHistory]);

  const handleExportJson = useCallback(() => { exportConfigJson({ templateName, templateDescription, templateAdat, templateNuansa, templateDesign, config }); toast.success('Config diekspor'); }, [templateName, templateDescription, templateAdat, templateNuansa, templateDesign, config]);

  const handleImportJson = useCallback(() => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
      const reader = new FileReader(); reader.onload = (ev) => {
        const text = ev.target?.result as string; const data = importConfigJson(text);
        if (data) { pushHistory(); setTemplateName(data.templateName); setTemplateDescription(data.templateDescription); setTemplateAdat(data.templateAdat); setTemplateNuansa(data.templateNuansa); setTemplateDesign(data.templateDesign); setConfig(data.config); toast.success('Config diimpor'); }
        else { toast.error('File JSON tidak valid'); }
      }; reader.readAsText(file);
    }; input.click();
  }, [pushHistory]);

  // Save
  const handleSave = async () => {
    if (!templateName.trim()) { toast.error('Nama template harus diisi'); return; }
    setSaving(true);
    try {
      const body = { name: templateName, description: templateDescription || undefined, nuansa: templateNuansa, adat: templateAdat, design: templateDesign, config: config as any };
      let res;
      if (editId) { res = await authFetch(`/api/template/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); }
      else { res = await authFetch('/api/template', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); }
      if (res.ok) { const data = await res.json(); toast.success('Template disimpan!'); clearDraft(); if (!editId && data.template?.id) router.push(`/template-builder?edit=${data.template.id}`); }
      else { const err = await res.json(); toast.error(err.error || 'Gagal menyimpan'); }
    } catch { toast.error('Gagal menyimpan'); } finally { setSaving(false); }
  };

  const selectedElement = config.sections.flatMap(s => s.elements).find(el => el.id === selectedElementId);
  const selectedElementSection = config.sections.find(s => s.elements.some(el => el.id === selectedElementId));
  const totalElements = config.sections.reduce((sum, s) => sum + s.elements.length, 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="size-8 animate-spin text-amber-600" /></div>;

  // Category colors for dots
  const categoryColors: Record<string, string> = {
    wayang: '#D97706', batik: '#6366F1', ornament: '#10B981', atmosphere: '#0EA5E9', frame: '#8B5CF6',
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* ─── HEADER ─── */}
      <header className="flex-shrink-0 bg-card/95 backdrop-blur-md border-b border-border px-3 py-2 flex items-center gap-2">
        <Link href="/dashboard" className="p-1.5 rounded-lg hover:bg-muted transition-colors"><ArrowLeft className="size-4 text-muted-foreground" /></Link>
        <input type="text" value={templateName} onChange={e => setTemplateName(e.target.value)} className="font-serif text-base font-bold bg-transparent border-none outline-none w-full max-w-[180px]" placeholder="Nama Template..." />
        <span className="text-[10px] text-muted-foreground hidden sm:inline whitespace-nowrap">{totalElements} properti</span>
        {draftMeta && <span className="text-[9px] text-muted-foreground/50 hidden md:inline"><Clock className="size-2.5 inline mr-0.5" />Auto-saved</span>}

        <div className="flex-1" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5 bg-muted/50 rounded-lg p-0.5">
          <button onClick={handleUndo} disabled={!canUndo} className="p-1.5 rounded-md disabled:opacity-30 hover:bg-background" title="Undo"><Undo2 className="size-3.5" /></button>
          <button onClick={handleRedo} disabled={!canRedo} className="p-1.5 rounded-md disabled:opacity-30 hover:bg-background" title="Redo"><Redo2 className="size-3.5" /></button>
        </div>

        {/* Animation play/pause */}
        <button onClick={() => setAnimationsPaused(!animationsPaused)} className={`p-1.5 rounded-lg transition-colors ${animationsPaused ? 'bg-amber-500/10 text-amber-500' : 'text-muted-foreground hover:bg-muted'}`} title={animationsPaused ? 'Putar Animasi' : 'Jeda Animasi'}>
          {animationsPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>

        {/* Presets */}
        <button onClick={() => setShowPresetPicker(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-600/30 text-amber-600 text-[11px] font-medium hover:bg-amber-600/5">
          <Zap className="size-3.5" /><span className="hidden sm:inline">Presets</span>
        </button>

        {/* Import/Export */}
        <button onClick={handleExportJson} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted" title="Ekspor"><Download className="size-4" /></button>
        <button onClick={handleImportJson} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted" title="Impor"><Upload className="size-4" /></button>

        {/* Save */}
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-[11px] font-medium hover:bg-amber-600/90 disabled:opacity-50">
          {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}Simpan
        </button>
      </header>

      {/* ─── THREE PANEL LAYOUT ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ═══ LEFT PANEL (280px) ═══ */}
        <div className="w-[280px] flex-shrink-0 border-r border-border flex flex-col bg-background overflow-hidden hidden lg:flex">
          {/* Theme settings */}
          <div className="flex-shrink-0 border-b border-border p-3 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Palette className="size-3" />Tema</div>
            <div className="grid grid-cols-3 gap-1.5">
              <div><label className="text-[9px] text-muted-foreground mb-0.5 block">Nuansa</label>
                <select value={templateNuansa} onChange={e => setTemplateNuansa(e.target.value)} className="w-full bg-background border border-border rounded px-1 py-1 text-[10px]">
                  <option value="islam">Islam</option><option value="umum">Umum</option></select></div>
              <div><label className="text-[9px] text-muted-foreground mb-0.5 block">Adat</label>
                <select value={templateAdat} onChange={e => setTemplateAdat(e.target.value)} className="w-full bg-background border border-border rounded px-1 py-1 text-[10px]">
                  <option value="jawa">Jawa</option><option value="sunda">Sunda</option><option value="batak">Batak</option><option value="bali">Bali</option><option value="arab">Arab</option></select></div>
              <div><label className="text-[9px] text-muted-foreground mb-0.5 block">Desain</label>
                <select value={templateDesign} onChange={e => setTemplateDesign(e.target.value)} className="w-full bg-background border border-border rounded px-1 py-1 text-[10px]">
                  {Object.values(DESIGN_VARIANTS).map(v => <option key={v.id} value={v.id}>{v.label}</option>)}</select></div>
            </div>
            <div className="h-4 rounded-md border border-border overflow-hidden" style={{ background: theme.bg }} />

            {/* Color palettes */}
            <div>
              <label className="text-[9px] text-muted-foreground mb-1 flex items-center gap-1"><Palette className="size-2.5" />Palet</label>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {JAVANESE_COLOR_PALETTES.map(palette => (
                  <button key={palette.id} onClick={() => updateConfig(prev => ({ ...prev, colorPalette: palette.id }))}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[8px] whitespace-nowrap transition-all flex-shrink-0 ${config.colorPalette === palette.id ? 'bg-amber-600/20 border border-amber-600/50 shadow-sm' : 'bg-muted/30 hover:bg-muted border border-border/30'}`}>
                    <div className="flex gap-0.5">
                      <div className="w-2.5 h-2.5 rounded-full border border-border/30" style={{ backgroundColor: palette.primary }} />
                      <div className="w-2.5 h-2.5 rounded-full border border-border/30" style={{ backgroundColor: palette.accent }} />
                    </div>
                    <span className="truncate max-w-[40px]">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Opening animation */}
            <div>
              <label className="text-[9px] text-muted-foreground mb-1 flex items-center gap-1"><Film className="size-2.5" />Pembuka</label>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {OPENING_ANIMATION_OPTIONS.map(anim => (
                  <button key={anim.id} onClick={() => updateConfig(prev => ({ ...prev, openingAnimation: anim.id }))}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[9px] whitespace-nowrap transition-all flex-shrink-0 ${(config.openingAnimation || 'envelope') === anim.id ? 'bg-amber-600 text-white shadow-sm' : 'bg-muted/50 hover:bg-muted border border-border/50'}`}>
                    <span>{anim.icon}</span><span>{anim.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Music */}
            <div>
              <label className="text-[9px] text-muted-foreground mb-1 flex items-center gap-1"><Music className="size-2.5" />Musik</label>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {MUSIC_PRESETS.map(preset => (
                  <button key={preset.id} onClick={() => updateConfig(prev => ({ ...prev, musicPreset: preset.id }))}
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[9px] whitespace-nowrap transition-all flex-shrink-0 ${config.musicPreset === preset.id ? 'bg-amber-600 text-white shadow-sm' : 'bg-muted/50 hover:bg-muted border border-border/50'}`}>
                    <span>{preset.icon}</span><span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-muted-foreground">Seksi</span>
              <span className="text-[9px] text-muted-foreground">{config.sections.filter(s => s.enabled).length}/{config.sections.length}</span>
            </div>
            {config.sections.map((section, idx) => {
              const isSelected = selectedSectionKey === section.key;
              const isExpanded = expandedSection === section.key;
              return (
                <div key={section.key}
                  className={`border rounded-lg overflow-hidden transition-all cursor-pointer ${isSelected ? 'border-amber-600/50 bg-amber-600/5 ring-1 ring-amber-600/20' : section.enabled ? 'border-border bg-card hover:border-amber-600/20' : 'border-border/50 bg-card/50 opacity-50'}`}
                  onClick={() => handleSectionClick(section.key)}
                  draggable onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; setDragIndex(idx); }}
                  onDragOver={e => { e.preventDefault(); setDragOverIndex(idx); }}
                  onDrop={e => { e.preventDefault(); handleDrop(idx); }}>
                  <div className="flex items-center gap-1.5 px-2 py-1.5">
                    <div className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground flex-shrink-0"><GripVertical className="size-3" /></div>
                    <button onClick={e => { e.stopPropagation(); setExpandedSection(isExpanded ? null : section.key); }} className="flex-shrink-0">
                      {isExpanded ? <ChevronDown className="size-3 text-muted-foreground" /> : <ChevronRight className="size-3 text-muted-foreground" />}</button>
                    <div className="flex gap-0.5 flex-shrink-0">
                      {section.elements.slice(0, 5).map((el, i) => { const info = COMPONENT_REGISTRY.find(c => c.type === el.component); return <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryColors[info?.category || 'ornament'] }} />; })}
                    </div>
                    <span className="text-[11px] font-medium flex-1 truncate">{SECTION_LABELS[section.key]}</span>
                    <span className="text-[9px] text-muted-foreground">{section.elements.length}</span>
                    <button onClick={e => { e.stopPropagation(); toggleSectionEnabled(section.key); }}
                      className={`w-7 h-3.5 rounded-full transition-colors relative flex-shrink-0 ${section.enabled ? 'bg-amber-600' : 'bg-border'}`}>
                      <div className={`w-2.5 h-2.5 rounded-full bg-white absolute top-[3px] transition-all ${section.enabled ? 'left-[14px]' : 'left-[3px]'}`} /></button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <div className="px-2 pb-2 space-y-2">
                          {/* Background settings */}
                          <SectionBackgroundSettings background={section.background} theme={theme} onChange={bg => updateSectionProps(section.key, { background: bg })} />

                          {/* Padding */}
                          <div className="flex gap-2 py-1 border-t border-border/50">
                            <div className="flex-1"><label className="text-[8px] text-muted-foreground block mb-0.5">Pad Atas</label>
                              <div className="flex items-center gap-1"><input type="range" min={0} max={8} step={1} value={section.paddingTop ?? 2} onChange={e => { e.stopPropagation(); updateSectionProps(section.key, { paddingTop: parseInt(e.target.value) }); }} className="flex-1 accent-amber-600 h-1" />
                                <span className="text-[8px] text-muted-foreground w-3 text-right">{section.paddingTop ?? 2}</span></div></div>
                            <div className="flex-1"><label className="text-[8px] text-muted-foreground block mb-0.5">Pad Bawah</label>
                              <div className="flex items-center gap-1"><input type="range" min={0} max={8} step={1} value={section.paddingBottom ?? 2} onChange={e => { e.stopPropagation(); updateSectionProps(section.key, { paddingBottom: parseInt(e.target.value) }); }} className="flex-1 accent-amber-600 h-1" />
                                <span className="text-[8px] text-muted-foreground w-3 text-right">{section.paddingBottom ?? 2}</span></div></div>
                          </div>

                          {/* Color pickers */}
                          <div className="flex gap-2 py-1 border-t border-border/50">
                            <div className="flex-1 flex items-center gap-1.5"><label className="text-[8px] text-muted-foreground">BG</label>
                              <input type="color" value={section.customBg || '#2C1810'} onChange={e => { e.stopPropagation(); updateSectionProps(section.key, { customBg: e.target.value }); }} className="w-5 h-5 rounded border border-border cursor-pointer" />
                              {section.customBg && <button onClick={e => { e.stopPropagation(); updateSectionProps(section.key, { customBg: undefined }); }} className="text-[7px] text-red-400">reset</button>}</div>
                            <div className="flex-1 flex items-center gap-1.5"><label className="text-[8px] text-muted-foreground">Aksen</label>
                              <input type="color" value={section.customAccent || '#D4AF37'} onChange={e => { e.stopPropagation(); updateSectionProps(section.key, { customAccent: e.target.value }); }} className="w-5 h-5 rounded border border-border cursor-pointer" />
                              {section.customAccent && <button onClick={e => { e.stopPropagation(); updateSectionProps(section.key, { customAccent: undefined }); }} className="text-[7px] text-red-400">reset</button>}</div>
                          </div>

                          {/* Elements list */}
                          {section.elements.map(el => {
                            const info = COMPONENT_REGISTRY.find(c => c.type === el.component);
                            const isElSelected = el.id === selectedElementId;
                            return (
                              <div key={el.id} onClick={e => { e.stopPropagation(); handleElementClick(isElSelected ? '' as any : el.id); }}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer transition-all text-[11px] ${isElSelected ? 'bg-amber-600/10 border border-amber-600/30' : 'bg-muted/50 border border-transparent hover:bg-muted'}`}>
                                <span className="text-sm">{info?.icon}</span><span className="flex-1 truncate">{info?.label}</span>
                              </div>
                            );
                          })}
                          <button onClick={e => { e.stopPropagation(); setPickerSectionKey(section.key); setPickerPosition(undefined); }}
                            className="w-full flex items-center justify-center gap-1 px-2 py-1 rounded-md border border-dashed border-amber-600/30 text-amber-600 hover:bg-amber-600/5 text-[10px]">
                            <Plus className="size-3" />Tambah Properti
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ CENTER CANVAS (flex-1) ═══ */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar above canvas */}
          <div className="flex-shrink-0 bg-card/50 border-b border-border px-3 py-1.5 flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-muted/50 rounded-lg p-0.5">
              <button onClick={() => setViewport('mobile')} className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all ${viewport === 'mobile' ? 'bg-amber-600 text-white shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}>
                <Smartphone className="size-3" /><span className="hidden sm:inline">375px</span>
              </button>
              <button onClick={() => setViewport('tablet')} className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all ${viewport === 'tablet' ? 'bg-amber-600 text-white shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}>
                <Tablet className="size-3" /><span className="hidden sm:inline">480px</span>
              </button>
              <button onClick={() => setViewport('desktop')} className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-all ${viewport === 'desktop' ? 'bg-amber-600 text-white shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}>
                <Monitor className="size-3" /><span className="hidden sm:inline">600px</span>
              </button>
            </div>
            <div className="flex-1" />
            <button onClick={() => setAnimationsPaused(!animationsPaused)} className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] ${animationsPaused ? 'bg-amber-500/10 text-amber-500' : 'text-muted-foreground hover:bg-muted'}`}>
              {animationsPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
              {animationsPaused ? 'Putar' : 'Jeda'}
            </button>
            <select value={templateDesign} onChange={e => setTemplateDesign(e.target.value)} className="bg-background border border-border rounded-md px-2 py-1 text-[10px]">
              {Object.values(DESIGN_VARIANTS).map(v => <option key={v.id} value={v.id}>{v.icon} {v.label}</option>)}
            </select>
            <select value={config.colorPalette || ''} onChange={e => updateConfig(prev => ({ ...prev, colorPalette: e.target.value || undefined }))}
              className="bg-background border border-border rounded-md px-2 py-1 text-[10px] max-w-[120px]">
              <option value="">Default</option>
              {JAVANESE_COLOR_PALETTES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Canvas area */}
          <div className="flex-1 bg-muted/30 flex items-start justify-center overflow-hidden">
            <div className="h-full w-full flex justify-center">
              <VisualPreviewCanvas
                config={config} selectedSectionKey={selectedSectionKey} selectedElementId={selectedElementId}
                theme={theme} animationsPaused={animationsPaused} viewport={viewport}
                onSectionClick={handleSectionClick} onElementClick={handleElementClick}
                onDropZoneClick={handleDropZoneClick} onTextElementClick={handleTextElementClick}
                onViewportChange={setViewport}
              />
            </div>
          </div>
        </div>

        {/* ═══ RIGHT PANEL (320px) ═══ */}
        <div className="w-[320px] flex-shrink-0 border-l border-border flex flex-col bg-background overflow-hidden hidden lg:flex">
          {selectedElement ? (
            <>
              <div className="flex-shrink-0 px-4 py-2 border-b border-border flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Properti Elemen</span>
                <button onClick={() => setSelectedElementId(null)} className="p-1 rounded hover:bg-muted"><X className="size-3.5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ElementPropertiesPanel
                  element={selectedElement} onChange={updates => updateElement(selectedElement.id, updates)}
                  onRemove={() => { if (selectedElementSection) removeElement(selectedElement.id); }}
                  onDuplicate={() => { if (selectedElementSection) duplicateElement(selectedElementSection.key, selectedElement.id); }}
                  autoFocusText={autoFocusTextElementId === selectedElement.id}
                />
              </div>
            </>
          ) : selectedSectionKey ? (
            <>
              <div className="flex-shrink-0 px-4 py-2 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">Seksi: {SECTION_LABELS[selectedSectionKey]}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <p className="text-xs text-muted-foreground">Klik elemen di canvas untuk mengedit propertinya, atau gunakan panel kiri untuk mengatur seksi.</p>
                <button onClick={() => { setPickerSectionKey(selectedSectionKey); setPickerPosition(undefined); }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-amber-600/30 text-amber-600 text-xs hover:bg-amber-600/5">
                  <Plus className="size-3.5" />Tambah Properti
                </button>
                {/* Presets for this section */}
                {SECTION_PRESETS.filter(p => p.targetSection === selectedSectionKey).length > 0 && (
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Zap className="size-2.5" />Preset Cepat</label>
                    <div className="space-y-1">
                      {SECTION_PRESETS.filter(p => p.targetSection === selectedSectionKey).map(preset => (
                        <button key={preset.id} onClick={() => handleApplyPreset(preset, false)}
                          className="w-full flex items-center gap-2 p-2 rounded-lg border border-border hover:border-amber-600/40 text-left text-xs">
                          <span className="text-lg">{preset.icon}</span>
                          <div><p className="font-medium text-[11px]">{preset.name}</p><p className="text-[9px] text-muted-foreground">{preset.description}</p></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center space-y-2">
                <Layers className="size-8 mx-auto text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">Pilih seksi atau elemen untuk mengedit</p>
                <p className="text-[10px] text-muted-foreground/60">Klik di canvas atau panel kiri</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ MODALS ═══ */}
      {pickerSectionKey && (
        <ComponentPickerModal
          onSelect={(comp, extraProps) => addElement(pickerSectionKey, comp, pickerPosition as PositionType | undefined, extraProps)}
          onClose={() => { setPickerSectionKey(null); setPickerPosition(undefined); }}
          sectionKey={pickerSectionKey} preferredPosition={pickerPosition}
        />
      )}
      {showPresetPicker && (
        <PresetPickerModal onApply={handleApplyPreset} onClose={() => setShowPresetPicker(false)} sectionKey={selectedSectionKey} />
      )}
    </div>
  );
}

// ─── Page wrapper with Suspense ───
export default function TemplateBuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="size-8 animate-spin text-amber-600" /></div>}>
      <VisualTemplateBuilderContent />
    </Suspense>
  );
}
