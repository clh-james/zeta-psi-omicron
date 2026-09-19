"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function GateForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/login";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/gate/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push(next);
    } else {
      setError("Access Denied — incorrect fraternity password.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-onyx bg-seal-radial px-4">
      <div className="w-full max-w-sm animate-seal-in">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="h-20 w-20 overflow-hidden rounded-full shadow-emboss">
            <Image
              src="/zeta-psi-omicron-seal.png"
              alt="Zeta Psi Omicron Fraternity Seal"
              width={80}
              height={80}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-parchment-muted">
              Zeta Psi Omicron Fraternity
            </p>
            <h1 className="mt-1 font-display text-2xl text-gold">Restricted Access</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-surface space-y-4 p-6">
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-parchment-muted">
              Fraternity Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/60" />
              <Input
                type="password"
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="pl-9"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-maroon-light">
              {error}
            </p>
          )}

          <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
            {loading ? "Verifying…" : "Unlock"}
          </Button>

          <p className="text-center text-xs text-parchment-muted">
            This system is restricted to verified Zeta Psi Omicron members and officers only.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function GatePage() {
  return (
    <Suspense>
      <GateForm />
    </Suspense>
  );
}
