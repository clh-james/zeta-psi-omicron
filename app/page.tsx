import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, ScrollText, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-onyx">
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 w-full border-b border-onyx-line bg-onyx/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full shadow-emboss">
              <Image
                src="/zeta-psi-omicron-seal.png"
                alt="Zeta Psi Omicron Seal"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="hidden font-display text-lg font-bold tracking-wider text-gold sm:inline-block">
              Zeta Psi Omicron
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/register">
              <Button variant="ghost" className="text-parchment hover:text-gold">
                Submit BioData
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="gold" className="shadow-emboss">
                Member Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-onyx-line bg-onyx-raised px-4 py-24 sm:py-32">
          {/* Subtle background radial for the "seal" effect */}
          <div className="absolute inset-0 bg-seal-radial opacity-40"></div>
          
          <div className="container relative mx-auto flex max-w-6xl flex-col items-center text-center">
            <div className="mb-8 flex items-center justify-center gap-6 animate-seal-in">
              <div className="h-32 w-32 overflow-hidden rounded-full shadow-emboss border-2 border-gold/40">
                <Image
                  src="/zeta-psi-omicron-seal.png"
                  alt="Zeta Psi Omicron Fraternity Seal"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover bg-onyx-raised"
                  priority
                />
              </div>
              <div className="h-32 w-32 overflow-hidden rounded-full shadow-emboss border-2 border-gold/40">
                <Image
                  src="/psi-zeta-omicron-seal.png"
                  alt="Psi Zeta Omicron Sorority Seal"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover bg-onyx-raised"
                  priority
                />
              </div>
            </div>
            
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-gold-light">
              One Brotherhood. One Nation.
            </p>
            <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-parchment sm:text-5xl md:text-6xl">
              National Member <br className="hidden sm:inline" />
              Information System
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-parchment-muted sm:text-xl">
              The official centralized database for the Zeta Psi Omicron Fraternity & Psi Zeta Omicron Sorority. 
              Manage your membership, access exclusive announcements, and stay connected 
              nationwide.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/login">
                <Button variant="gold" size="lg" className="w-full sm:w-auto text-base">
                  Access Portal <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-gold/50 text-gold hover:bg-gold/10 text-base">
                  Submit Member BioData
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES / INFO SECTION */}
        <section className="px-4 py-20 bg-onyx">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="font-display text-3xl font-bold text-gold sm:text-4xl">
                A Modern Fraternity Database
              </h2>
              <div className="mt-4 flex justify-center">
                <div className="h-px w-24 bg-gold/50"></div>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="card-surface p-8 text-center transition-transform hover:-translate-y-1">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-onyx border border-gold/30 text-gold shadow-emboss">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-parchment">Secure Access</h3>
                <p className="text-parchment-muted leading-relaxed">
                  Protected by a robust role-based access system. Only verified members and officers can access internal fraternity data and announcements.
                </p>
              </div>

              <div className="card-surface p-8 text-center transition-transform hover:-translate-y-1">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-onyx border border-gold/30 text-gold shadow-emboss">
                  <ScrollText className="h-8 w-8" />
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-parchment">Digital BioData</h3>
                <p className="text-parchment-muted leading-relaxed">
                  Transition from paper to a fully digital centralized registry. Update your personal, educational, and professional information anytime.
                </p>
              </div>

              <div className="card-surface p-8 text-center transition-transform hover:-translate-y-1">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-onyx border border-gold/30 text-gold shadow-emboss">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-parchment">National Network</h3>
                <p className="text-parchment-muted leading-relaxed">
                  Connect with brothers across different chapters and regions. Stay updated on national events and structural organizational changes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HISTORY SECTION */}
        <section className="border-y border-onyx-line bg-onyx-raised px-4 py-20 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <h2 className="mb-6 font-display text-3xl font-bold text-parchment">
              Founded January 29, 1965
            </h2>
            <p className="text-lg leading-relaxed text-parchment-muted sm:text-xl">
              Established at the University of the Philippines Los Baños (UPLB). For decades, Zeta Psi Omicron has fostered leadership, academic excellence, and an unbreakable bond of brotherhood. 
            </p>
            <p className="mt-6 font-display text-xl text-gold italic">
              "We Lead, We Serve, We Excel."
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-onyx-line bg-onyx px-4 py-8">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/zeta-psi-omicron-seal.png" alt="Seal" width={24} height={24} className="opacity-70" />
            <p className="text-sm text-parchment-muted">
              &copy; {new Date().getFullYear()} Zeta Psi Omicron Fraternity. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-parchment-muted">
            <Link href="/gate" className="hover:text-gold transition-colors">Admin Gateway</Link>
            <Link href="/login" className="hover:text-gold transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
