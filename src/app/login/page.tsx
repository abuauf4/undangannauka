"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck } from "lucide-react";
import { isAdminLoggedIn } from "@/lib/api-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const router = useRouter();

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    if (isAdminLoggedIn()) {
      router.push("/dashboard");
    }
  }, [router]);

  // Detect when user types "nauka" in email/username field to switch to admin mode
  const handleUsernameChange = (value: string) => {
    if (isAdminMode) {
      setUsername(value);
    } else {
      setEmail(value);
      // Switch to admin mode if username is "nauka"
      if (value.toLowerCase() === "nauka") {
        setIsAdminMode(true);
        setUsername(value);
        setEmail("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isAdminMode) {
        // Admin login via bypass API
        const res = await fetch("/api/auth/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (data.success) {
          // Store admin auth in localStorage
          localStorage.setItem("adminAuth", JSON.stringify({
            userId: data.userId,
            authHeader: data.authHeader,
            email: data.email,
            isLoggedIn: true,
          }));
          router.push("/dashboard");
        } else {
          setError(data.error || "Username atau password salah");
        }
      } else {
        // Standard NextAuth login
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Email atau password salah");
        } else {
          router.push("/dashboard");
        }
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FFFBF5" }}>
      <div className="absolute inset-0 arabesque-bg opacity-30" />
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold" style={{ color: "#800020" }}>
                Undangan<span className="gold-gradient-text">Nauka</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              {isAdminMode ? "Login Admin" : "Masuk ke dashboard Anda"}
            </p>
          </div>

          {/* Admin mode indicator */}
          {isAdminMode && (
            <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-lg p-3 mb-4 flex items-center gap-2">
              <ShieldCheck className="size-4 text-[var(--gold)] flex-shrink-0" />
              <p className="text-xs text-[var(--gold)] font-medium">Mode Admin — Masukkan username & password admin</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isAdminMode ? (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-border focus:border-[var(--gold)]"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  required
                  className="border-border focus:border-[var(--gold)]"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-border focus:border-[var(--gold)]"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all h-11"
            >
              {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {isAdminMode ? "Login Admin" : "Masuk"}
            </Button>
          </form>

          {/* Toggle between admin and regular login */}
          <div className="mt-4 text-center">
            {isAdminMode ? (
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(false);
                  setUsername("");
                  setPassword("");
                  setError("");
                }}
                className="text-sm text-muted-foreground hover:text-[var(--gold)] transition-colors"
              >
                ← Kembali ke login biasa
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(true);
                  setEmail("");
                  setPassword("");
                  setError("");
                }}
                className="text-sm text-muted-foreground hover:text-[var(--gold)] transition-colors flex items-center gap-1.5 justify-center"
              >
                <ShieldCheck className="size-3.5" />
                Admin? Login dengan akun admin
              </button>
            )}
          </div>

          {!isAdminMode && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Belum punya akun?{" "}
              <Link href="/register" className="text-[var(--gold)] font-medium hover:underline">
                Daftar gratis
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
