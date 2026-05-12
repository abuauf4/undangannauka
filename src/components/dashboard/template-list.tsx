"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye, Trash2, Edit3, Plus, MoonStar, Loader2, Copy,
  MoreHorizontal, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authFetch } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DbTemplate {
  id: string;
  name: string;
  description: string | null;
  nuansa: string;
  adat: string;
  design: string;
  config: Record<string, unknown>;
  isDefault: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ─── Gradient map ─── */
function getGradientForTemplate(nuansa: string, adat: string): string {
  const key = `${nuansa}-${adat}`;
  const gradients: Record<string, string> = {
    'islam-jawa': 'from-[#800020] via-[#5C0015] to-[#C9A84C]',
    'islam-sunda': 'from-[#1a472a] via-[#2d6a4f] to-[#C9A84C]',
    'islam-batak': 'from-[#5C0015] via-[#8B0000] to-[#C9A84C]',
    'islam-bali': 'from-[#4a1942] via-[#800020] to-[#C9A84C]',
    'islam-arab': 'from-[#1a3c34] via-[#2d5a4e] to-[#C9A84C]',
    'umum-jawa': 'from-[#800020] via-[#5C0015] to-[#C9A84C]',
    'umum-sunda': 'from-[#2d6a4f] via-[#1a472a] to-[#D4AF37]',
    'umum-batak': 'from-[#8B0000] via-[#5C0015] to-[#D4AF37]',
  };
  return gradients[key] || 'from-[#800020] via-[#5C0015] to-[#C9A84C]';
}

export function TemplateList() {
  const router = useRouter();
  const [templates, setTemplates] = useState<DbTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const res = await fetch("/api/template");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates);
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus template "${name}"? Aksi ini tidak bisa dibatalkan.`)) return;
    setDeletingId(id);
    try {
      const res = await authFetch(`/api/template/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(`Template "${name}" berhasil dihapus`);
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menghapus template");
      }
    } catch (err) {
      toast.error("Gagal menghapus template");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDuplicate(template: DbTemplate) {
    try {
      const res = await authFetch("/api/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${template.name} (Copy)`,
          description: template.description,
          nuansa: template.nuansa,
          adat: template.adat,
          design: template.design,
          config: template.config,
        }),
      });
      if (res.ok) {
        toast.success("Template berhasil diduplikasi");
        fetchTemplates();
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menduplikasi template");
      }
    } catch (err) {
      toast.error("Gagal menduplikasi template");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[var(--gold)]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold">
            Template Saya
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {templates.length} template tersedia
          </p>
        </div>
        <Button
          onClick={() => router.push("/template-builder")}
          className="bg-[var(--gold)] text-white hover:bg-[var(--gold)]/90 text-sm"
        >
          <Plus className="size-4 mr-1.5" />
          Buat Template Baru
        </Button>
      </div>

      {/* Empty state */}
      {templates.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
          <MoonStar className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold mb-2">
            Belum Ada Template
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Buat template undangan pertama Anda dengan menambahkan properti Jawa satu per satu
          </p>
          <Button
            onClick={() => router.push("/template-builder")}
            className="bg-[var(--gold)] text-white hover:bg-[var(--gold)]/90"
          >
            <Plus className="size-4 mr-1.5" />
            Buat Template Baru
          </Button>
        </div>
      )}

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => {
          const gradient = getGradientForTemplate(template.nuansa, template.adat);
          const isDeleting = deletingId === template.id;

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:border-[var(--gold)]/50 hover:shadow-lg transition-all"
            >
              {/* Gradient preview */}
              <div className={`relative aspect-[16/9] bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <div className="text-center text-white">
                  <MoonStar className="size-8 mx-auto mb-2 opacity-60" />
                  <span className="font-[family-name:var(--font-playfair)] text-lg font-bold">
                    {template.name}
                  </span>
                </div>

                {/* Hover actions overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => router.push(`/template-builder?edit=${template.id}`)}
                    className="p-2 rounded-lg bg-white/90 text-gray-800 hover:bg-[var(--gold)] hover:text-white transition-all"
                    title="Edit"
                  >
                    <Edit3 className="size-4" />
                  </button>
                  <button
                    onClick={() => window.open(`/template-preview?id=${template.id}`, '_blank')}
                    className="p-2 rounded-lg bg-white/90 text-gray-800 hover:bg-[var(--gold)] hover:text-white transition-all"
                    title="Preview"
                  >
                    <Eye className="size-4" />
                  </button>
                  <button
                    onClick={() => window.open(`/template/${template.id}`, '_blank')}
                    className="p-2 rounded-lg bg-white/90 text-gray-800 hover:bg-[var(--gold)] hover:text-white transition-all"
                    title="Lihat halaman publik"
                  >
                    <ExternalLink className="size-4" />
                  </button>
                </div>

                {/* Default badge */}
                {template.isDefault && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-[var(--gold)] text-white text-[10px] shadow-md">
                      Default
                    </Badge>
                  </div>
                )}
              </div>

              {/* Card info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-sm truncate">
                    {template.name}
                  </h3>
                </div>

                {template.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {template.description}
                  </p>
                )}

                {/* Tags */}
                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                  <Badge variant="secondary" className="bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20 text-[10px]">
                    {template.adat.charAt(0).toUpperCase() + template.adat.slice(1)}
                  </Badge>
                  <Badge variant="secondary" className="bg-[var(--burgundy)]/10 text-[var(--burgundy)] text-[10px]">
                    {template.nuansa === 'islam' ? 'Islami' : 'Umum'}
                  </Badge>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px]">
                    {template.design.charAt(0).toUpperCase() + template.design.slice(1)}
                  </Badge>
                </div>

                {/* Config summary */}
                {template.config && typeof template.config === 'object' && 'sections' in template.config && (
                  <p className="text-[10px] text-muted-foreground/60 mb-3">
                    {(template.config.sections as unknown[])?.length || 0} seksi
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                  <button
                    onClick={() => router.push(`/template-builder?edit=${template.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all"
                  >
                    <Edit3 className="size-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDuplicate(template)}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                    title="Duplikasi"
                  >
                    <Copy className="size-3.5 text-muted-foreground" />
                  </button>
                  {!template.isDefault && (
                    <button
                      onClick={() => handleDelete(template.id, template.name)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg border border-border hover:bg-red-500/10 hover:border-red-500/30 transition-colors disabled:opacity-50"
                      title="Hapus"
                    >
                      {isDeleting ? (
                        <Loader2 className="size-3.5 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="size-3.5 text-red-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
