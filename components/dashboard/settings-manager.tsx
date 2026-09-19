"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateFraternityPassword } from "@/app/dashboard/settings/actions";
import { Lock, CheckCircle2 } from "lucide-react";

export function SettingsManager() {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    startTransition(async () => {
      const res = await updateFraternityPassword(password);
      if (res.ok) {
        setSuccess(true);
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(res.error || "An unknown error occurred.");
      }
    });
  };

  return (
    <div className="card-surface p-6 max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-5 h-5 text-gold" />
        <h2 className="font-display text-xl text-gold">Fraternity Password</h2>
      </div>
      
      <p className="text-sm text-parchment-muted mb-6">
        This is the global password that all applicants must enter during registration to verify they belong to the fraternity. 
        Update it periodically for security.
      </p>

      {success && (
        <div className="mb-6 p-4 rounded-card bg-green-500/10 border border-green-500/30 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          <p className="text-sm text-green-500">Fraternity password updated successfully. All new registrants must use the new password.</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-card bg-red-500/10 border border-red-500/30">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-parchment-muted">New Password</label>
          <Input 
            type="password" 
            placeholder="Enter new global password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isPending}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-parchment-muted">Confirm Password</label>
          <Input 
            type="password" 
            placeholder="Re-enter password" 
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={isPending}
            required
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" variant="gold" disabled={isPending || !password}>
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
