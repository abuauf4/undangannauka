'use client';

import React, { createContext, useContext, useMemo } from 'react';
import {
  resolveTheme,
  themeToStyle,
  type ResolvedTheme,
  type NuansaTextConfig,
  type AdatTextConfig,
  type TingkatPreset,
  type ThemeVariables,
} from '@/lib/theme-config';
import type { NuansaType, AdatType, DesignType } from '@/lib/template-data';

/* ─── Context ─── */
interface ThemeContextValue {
  theme: ResolvedTheme;
  variables: ThemeVariables;
  nuansa: NuansaTextConfig;
  adat: AdatTextConfig;
  tingkat: TingkatPreset;
  adatKey: AdatType;
  nuansaKey: NuansaType;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* ─── Hook ─── */
export function useInvitationTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback to Islam × Jawa × Mewah
    const fallback = resolveTheme('islam', 'jawa', 'mewah');
    return {
      theme: fallback,
      variables: fallback.variables,
      nuansa: fallback.nuansa,
      adat: fallback.adat,
      tingkat: fallback.tingkat,
      adatKey: fallback.adatKey,
      nuansaKey: fallback.nuansaKey,
    };
  }
  return ctx;
}

/* ─── Provider Props ─── */
interface InvitationThemeProviderProps {
  nuansa?: NuansaType;
  adat?: AdatType;
  tingkat?: DesignType;
  children: React.ReactNode;
}

/* ─── Provider Component ─── */
export function InvitationThemeProvider({
  nuansa = 'islam',
  adat = 'jawa',
  tingkat = 'mewah',
  children,
}: InvitationThemeProviderProps) {
  const theme = useMemo(() => resolveTheme(nuansa, adat, tingkat), [nuansa, adat, tingkat]);
  const style = useMemo(() => themeToStyle(theme.variables), [theme.variables]);

  const value = useMemo(
    () => ({
      theme,
      variables: theme.variables,
      nuansa: theme.nuansa,
      adat: theme.adat,
      tingkat: theme.tingkat,
      adatKey: theme.adatKey,
      nuansaKey: theme.nuansaKey,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div style={style} className="invitation-theme-wrapper">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
