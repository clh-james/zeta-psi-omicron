"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError("Incorrect username/email or password.");
      return;
    }

    // "Remember me" controls Supabase's session persistence via storage —
    // handled at client init in a production build; kept simple here.
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-onyx px-4 relative">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-parchment-muted hover:text-gold transition-colors group z-10">
        <div className="bg-onyx-raised border border-onyx-line rounded-full p-2 group-hover:border-gold/50 transition-colors shadow-emboss">
          <Home className="w-4 h-4" />
        </div>
        <span className="hidden sm:inline tracking-wider uppercase text-xs">Home</span>
      </Link>
      
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="h-16 w-16 overflow-hidden rounded-full shadow-emboss">
            <Image
              src="/zeta-psi-omicron-seal.png"
              alt="Zeta Psi Omicron Fraternity Seal"
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="font-display text-2xl text-gold">Member Login</h1>
          <p className="text-sm text-parchment-muted">
            Zeta Psi Omicron National Member Information System
          </p>
          <div className="mt-2 w-full max-w-[250px]">
            <audio controls className="h-8 w-full">
              <source src="/anthem.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-surface space-y-4 p-6">
          <div className="space-y-1.5">
            <Label htmlFor="email">Username / Email</Label>
            <Input
              id="email"
              type="text"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-parchment-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-3.5 w-3.5 accent-[#C9A227]"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-gold hover:text-gold-light">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-maroon-light">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>

          <p className="text-center text-xs text-parchment-muted">
            Not yet a registered member?{" "}
            <Link href="/register" className="text-gold hover:text-gold-light">
              Submit your BioData
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
