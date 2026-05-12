# Task: Rebuild Template Builder for TRUE WYSIWYG

## Summary
Rebuilt three core files of the UndanganNauka template builder to achieve true WYSIWYG rendering at full invitation size.

## Files Rewritten

### 1. `/home/z/my-project/src/components/builder/visual-section-renderer.tsx`
- **Scaled up from mini (40-80px) to full invitation size (80-200px)**
- Added `getAnimationCSS()` function mapping all 44+ AnimationType values to CSS keyframe names
- Added `renderSectionBackgroundStyle()` for per-section backgrounds (solid/pattern/photo/gradient)
- Added `getPatternClassName()` for batik pattern CSS classes (inv-jawa-parang-bg, etc.)
- Wayang renderers now use full-size dimension maps
- ElementWrapper applies animation CSS, opacity, size, X/Y offset via `transform: translate(xOffset%, yOffset%)`
- Section backgrounds rendered with pattern overlay, photo overlay, gradient support
- Click on element shows blue ring highlight, click on section shows blue ring
- Section label badge appears when selected

### 2. `/home/z/my-project/src/components/builder/visual-preview-canvas.tsx`
- Simplified to scrollable mobile-width container (375/480/600px)
- No phone bezel/frame — just the actual invitation view
- Viewport switcher: Mobile 375px, Tablet 480px, Desktop 600px
- Section navigation strip at bottom
- Auto-scroll to selected section
- Animation play/pause indicator

### 3. `/home/z/my-project/src/app/template-builder/page.tsx`
- Three-panel layout: Left (280px) | Center (flex-1) | Right (320px)
- Left panel: Theme settings (nuansa/adat/design), color palette, opening animation, music, section list with expand/collapse, background settings per section, padding/color controls
- Center: Canvas toolbar (viewport switcher, animation play/pause, design variant, palette) + VisualPreviewCanvas
- Right panel: ElementPropertiesPanel with position picker (3x3 grid), animation dropdown (44+ types), duration/delay sliders, size selector, opacity slider, X/Y offset sliders, custom width slider, component-specific props, duplicate/delete buttons
- SectionBackgroundSettings component for solid/pattern/photo/gradient backgrounds
- ComponentPickerModal with category tabs, suggested components, custom image upload
- PresetPickerModal for quick preset application
- Full keyboard shortcuts (Ctrl+Z/Y/S, Delete, Escape)
- Auto-save draft every 3 seconds
- Undo/Redo with HistoryManager

## TypeScript Status
- Zero errors in all three builder files (verified with tsc --noEmit)
- Dev server compiles and serves /template-builder with 200 status

## Issues
- None found in the builder files. Pre-existing errors exist in other files (landing components, etc.) but those are not related to this task.
