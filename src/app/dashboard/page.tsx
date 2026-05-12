"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { InvitationList } from "@/components/dashboard/invitation-list";
import { RSVPTable } from "@/components/dashboard/rsvp-table";
import { GuestbookAdmin } from "@/components/dashboard/guestbook-admin";
import { PaymentSection } from "@/components/dashboard/payment-section";
import { TemplateList } from "@/components/dashboard/template-list";
import { Loader2, Menu, X, LogOut } from "lucide-react";
import { authFetch, isAdminLoggedIn, getAdminAuthData, clearAdminAuth } from "@/lib/api-client";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [invitations, setInvitations] = useState<unknown[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("User");
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    // Check if logged in via admin bypass
    if (isAdminLoggedIn()) {
      const adminData = getAdminAuthData();
      setIsAuthenticated(true);
      setUserName("Admin");
      setAdminMode(true);
    } else {
      // Check NextAuth session
      import("next-auth/react").then(({ useSession }) => {
        // NextAuth session check handled by the session provider
      });
    }
  }, []);

  // Check NextAuth session
  const [sessionStatus, setSessionStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    async function checkSession() {
      try {
        // Try to fetch session from NextAuth
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data?.user) {
          setIsAuthenticated(true);
          setUserName(data.user.name || "User");
          setAdminMode(false);
          setSessionStatus("authenticated");
        } else {
          setSessionStatus("unauthenticated");
        }
      } catch {
        setSessionStatus("unauthenticated");
      }
    }

    // If admin is already logged in, skip session check
    if (isAdminLoggedIn()) {
      setSessionStatus("authenticated");
      return;
    }

    checkSession();
  }, []);

  useEffect(() => {
    // If not authenticated by any method, redirect to login
    if (sessionStatus === "unauthenticated" && !isAdminLoggedIn()) {
      router.push("/login");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchInvitations() {
      try {
        const res = await authFetch("/api/invitation");
        const data = await res.json();
        setInvitations(data.invitations || []);
      } catch (err) {
        console.error("Failed to fetch invitations:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchInvitations();
  }, [isAuthenticated]);

  const handleLogout = () => {
    if (adminMode) {
      clearAdminAuth();
    }
    router.push("/login");
  };

  if (sessionStatus === "loading" && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FFFBF5" }}>
        <Loader2 className="size-8 animate-spin" style={{ color: "#C9A84C" }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="h-full">
            <DashboardSidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="font-[family-name:var(--font-playfair)] text-lg font-bold" style={{ color: "#800020" }}>
          Undangan<span className="gold-gradient-text">Nauka</span>
        </span>
        <div className="flex items-center gap-2">
          {adminMode && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              title="Logout"
            >
              <LogOut className="size-4 text-muted-foreground" />
            </button>
          )}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1">
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:p-8 p-4 pt-16 lg:pt-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-foreground">
                Selamat datang, <span className="gold-gradient-text">{userName}</span>
              </h1>
              {adminMode && (
                <button
                  onClick={handleLogout}
                  className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola undangan pernikahan digital Anda
            </p>
            {adminMode && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                Mode Admin
              </div>
            )}
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-[var(--gold)]" />
            </div>
          ) : (
            <>
              {tab === "overview" && (
                <>
                  <StatsCards invitations={invitations} />
                  <InvitationList invitations={invitations} />
                </>
              )}
              {tab === "templates" && <TemplateList />}
              {tab === "rsvp" && <RSVPTable invitations={invitations} />}
              {tab === "guestbook" && <GuestbookAdmin invitations={invitations} />}
              {tab === "payment" && <PaymentSection invitations={invitations} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FFFBF5" }}>
          <Loader2 className="size-8 animate-spin" style={{ color: "#C9A84C" }} />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
