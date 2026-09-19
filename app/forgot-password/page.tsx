"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-onyx px-4">
      <div className="w-full max-w-sm card-surface p-6">
        <h1 className="mb-1 font-display text-xl text-gold">Reset Password</h1>
        <p className="mb-4 text-sm text-parchment-muted">
          Enter your registered email and we'll send you a reset link.
        </p>

        {sent ? (
          <p className="text-sm text-gold">Check your inbox for the reset link.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-maroon-light">{error}</p>}
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
