"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { clearAdminAuth, isAdminLoggedIn } from "@/lib/api-client";

export function SignOutButton() {
  const handleSignOut = async () => {
    // Clear admin auth if logged in as admin
    if (isAdminLoggedIn()) {
      clearAdminAuth();
    }
    // Also sign out of NextAuth (in case both sessions exist)
    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      // If NextAuth signOut fails (not authenticated via NextAuth), just redirect
      window.location.href = "/";
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-red-500 transition-colors w-full"
    >
      <LogOut className="size-4" />
      Keluar
    </button>
  );
}
