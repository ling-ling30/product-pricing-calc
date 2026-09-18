"use client";

import React, { useState } from "react";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, CheckCircle2 } from "lucide-react";

export function AuthButton() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL: window.location.href,
      });
    } catch (e) {
      console.warn("Sign in with Google triggered (ensure Google credentials configured):", e);
      alert("Google OAuth: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your Vercel or .env.local file to authenticate live accounts.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-secondary border border-border text-xs">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="h-5 w-5 rounded-full object-cover"
            />
          ) : (
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
              <User className="h-3 w-3" />
            </div>
          )}
          <span className="font-medium text-foreground truncate max-w-[110px]">
            {session.user.name || session.user.email}
          </span>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-90"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignIn}
      disabled={loading}
      className="text-xs shadow-none border-border"
    >
      <svg className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
      Sign in with Google
    </Button>
  );
}
