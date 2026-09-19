import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, ScrollText, ChevronRight, Menu, MapPin, Building2, Calendar, Newspaper, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-onyx text-parchment font-body">
      {/* 1. NAVIGATION */}
      <header className="sticky top-0 z-50 w-full border-b border-onyx-line bg-onyx/80 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full shadow-[0_0_15px_rgba(201,162,39,0.3)]">
              <Image
                src="/zeta-psi-omicron-seal.png"
                alt="Zeta Psi Omicron Seal"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="hidden font-display text-xl font-bold tracking-widest text-gold lg:inline-block uppercase">
              Zeta Psi Omicron
            </span>
          </div>
          
          <nav className="hidden items-center gap-8 md:flex text-sm font-medium tracking-wide">
            <Link href="/" className="text-gold border-b border-gold pb-1">Home</Link>
            <Link href="#about" className="text-parchment-muted hover:text-gold transition-colors">About</Link>
            <Link href="#history" className="text-parchment-muted hover:text-gold transition-colors">History</Link>
            <Link href="#chapters" className="text-parchment-muted hover:text-gold transition-colors">Chapters</Link>
            <Link href="/dashboard/directory" className="text-parchment-muted hover:text-gold transition-colors">Members</Link>
            <Link href="#news" className="text-parchment-muted hover:text-gold transition-colors">News</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/register" className="hidden sm:block">
              <Button variant="ghost" className="text-parchment hover:text-gold uppercase text-xs tracking-wider border border-onyx-line hover:border-gold/30">
                Submit Biodata
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="gold" className="uppercase text-xs tracking-wider shadow-emboss">
                Member Login
              </Button>
            </Link>
            <button className="md:hidden text-parchment hover:text-gold p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <section className="relative overflow-hidden border-b border-onyx-line bg-onyx-raised px-4 py-32 sm:py-40">
          <div className="absolute inset-0 bg-seal-radial opacity-30"></div>
          
          <div className="container relative mx-auto flex max-w-5xl flex-col items-center text-center">
            <div className="mb-12 h-56 w-56 sm:h-72 sm:w-72 animate-seal-in overflow-hidden rounded-full shadow-[0_0_80px_rgba(201,162,39,0.25)] border-2 border-gold/40 relative">
              <div className="absolute inset-0 bg-gold/5 mix-blend-overlay"></div>
              <Image
                src="/zeta-psi-omicron-seal.png"
                alt="Zeta Psi Omicron 3D Seal"
                width={288}
                height={288}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            
            <p className="mb-6 text-sm sm:text-base font-bold uppercase tracking-[0.5em] text-gold animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              One Brotherhood. One Nation.
            </p>
            <h1 className="mb-8 font-display text-5xl font-bold leading-tight text-parchment sm:text-6xl md:text-7xl drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              NATIONAL MEMBER <br className="hidden sm:inline" />
              INFORMATION SYSTEM
            </h1>
            <p className="mx-auto mb-12 max-w-3xl text-lg text-parchment-muted sm:text-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 leading-relaxed">
              The official centralized platform connecting Zeta Psi Omicron members, chapters, officers, and alumni nationwide.
            </p>
            
            <div className="flex flex-col gap-6 sm:flex-row w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="gold" size="lg" className="w-full text-sm tracking-widest uppercase h-14 px-8 shadow-emboss group">
                  Member Portal <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-sm tracking-widest uppercase h-14 px-8 border-gold/50 text-gold hover:bg-gold/10 hover:text-gold-light transition-colors">
                  Submit Biodata
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 3. NATIONAL STATISTICS */}
        <section className="border-b border-onyx-line bg-onyx px-4 py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 divide-x divide-onyx-line">
              <div className="flex flex-col items-center text-center px-4">
                <span className="font-display text-4xl font-bold text-gold sm:text-5xl mb-2">1965</span>
                <span className="text-xs uppercase tracking-widest text-parchment-muted">Year Founded</span>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <span className="font-display text-4xl font-bold text-parchment sm:text-5xl mb-2">4,200+</span>
                <span className="text-xs uppercase tracking-widest text-parchment-muted">Registered Members</span>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <span className="font-display text-4xl font-bold text-parchment sm:text-5xl mb-2">145+</span>
                <span className="text-xs uppercase tracking-widest text-parchment-muted">Active Chapters</span>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <span className="font-display text-4xl font-bold text-parchment sm:text-5xl mb-2">61</span>
                <span className="text-xs uppercase tracking-widest text-parchment-muted">Years of Brotherhood</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CORE PLATFORM FEATURES */}
        <section className="px-4 py-24 bg-onyx-raised border-b border-onyx-line">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-parchment sm:text-4xl uppercase tracking-wider mb-6">
                Core Platform Features
              </h2>
              <div className="mx-auto h-1 w-20 bg-gold/60 rounded-full mb-6"></div>
              <p className="text-parchment-muted text-lg">Secure digital infrastructure designed specifically for the administrative and organizational needs of the fraternity.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: ShieldCheck, title: "SECURE MEMBER PORTAL", desc: "Access authorized fraternity information and exclusive member services with enterprise-grade security." },
                { icon: ScrollText, title: "DIGITAL BIODATA", desc: "Submit, verify, and maintain official member information in our centralized registry." },
                { icon: Users, title: "NATIONAL DIRECTORY", desc: "Connect with authenticated brothers and chapters nationwide while preserving data privacy." },
                { icon: Building2, title: "CHAPTER MANAGEMENT", desc: "Equip chapter officers to manage rosters, verify initiates, and streamline local operations." }
              ].map((feature, i) => (
                <div key={i} className="group flex flex-col items-start p-8 rounded-lg bg-onyx border border-onyx-line hover:border-gold/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                  <div className="mb-6 rounded-md bg-onyx-raised p-4 text-gold shadow-emboss group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 stroke-[1.5]" />
                  </div>
                  <h3 className="mb-4 font-display text-xl font-bold text-parchment tracking-wide">{feature.title}</h3>
                  <p className="text-parchment-muted leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. FIND YOUR CHAPTER & 6. NATIONAL MEMBER DIRECTORY PROMO */}
        <section id="chapters" className="px-4 py-24 bg-onyx relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-onyx-raised/50 -skew-x-12 translate-x-1/4"></div>
          <div className="container relative mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display text-4xl font-bold text-parchment uppercase tracking-wider mb-6">Find Your Chapter</h2>
                <div className="h-1 w-16 bg-gold/60 rounded-full mb-8"></div>
                <p className="text-parchment-muted text-lg mb-8 leading-relaxed">
                  Discover Zeta Psi Omicron chapters across the nation. View chapter leadership, location details, and aggregate member counts.
                </p>
                <Link href="/chapters">
                  <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-onyx uppercase tracking-widest text-sm h-12 px-8">
                    View Chapter Registry
                  </Button>
                </Link>
              </div>
              <div className="bg-onyx-raised border border-onyx-line rounded-xl p-8 shadow-2xl relative">
                <div className="absolute -top-4 -right-4 bg-gold text-onyx font-bold px-4 py-1 text-xs uppercase tracking-widest rounded-sm shadow-lg">Protected</div>
                <h3 className="font-display text-2xl font-bold text-parchment mb-4 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-gold" /> National Member Directory
                </h3>
                <p className="text-parchment-muted mb-8 text-sm leading-relaxed">
                  The complete member directory is heavily restricted to protect privacy. Only authenticated members can search the directory, and sensitive information is never exposed.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="h-10 w-full bg-onyx rounded flex items-center px-4 border border-onyx-line opacity-50">
                    <div className="h-4 w-4 rounded-full bg-gold/30 mr-3"></div>
                    <div className="h-2 w-1/3 bg-parchment-muted/30 rounded"></div>
                  </div>
                  <div className="h-10 w-full bg-onyx rounded flex items-center px-4 border border-onyx-line opacity-50">
                    <div className="h-4 w-4 rounded-full bg-gold/30 mr-3"></div>
                    <div className="h-2 w-1/2 bg-parchment-muted/30 rounded"></div>
                  </div>
                </div>
                <Link href="/login">
                  <Button variant="gold" className="w-full shadow-emboss text-sm uppercase tracking-widest">
                    Login to Access Directory
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 7. ABOUT ZETA PSI OMICRON & 8. TIMELINE */}
        <section id="about" className="px-4 py-24 bg-onyx-raised border-y border-onyx-line">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="font-display text-3xl font-bold text-gold sm:text-4xl uppercase tracking-widest mb-16">
              About Zeta Psi Omicron
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12 mb-24">
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-bold text-parchment uppercase tracking-widest mb-6 pb-4 border-b border-gold/30 w-full">Mission</h3>
                <p className="text-parchment-muted leading-relaxed text-sm">To foster leadership, academic excellence, and an unbreakable bond of brotherhood, empowering members to serve their communities with honor.</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-bold text-parchment uppercase tracking-widest mb-6 pb-4 border-b border-gold/30 w-full">Vision</h3>
                <p className="text-parchment-muted leading-relaxed text-sm">To be the premier national fraternity shaping the next generation of leaders through unyielding solidarity and progressive action.</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-bold text-parchment uppercase tracking-widest mb-6 pb-4 border-b border-gold/30 w-full">Core Values</h3>
                <ul className="text-parchment-muted space-y-3 text-sm">
                  <li className="flex items-center justify-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold"></div> Leadership</li>
                  <li className="flex items-center justify-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold"></div> Brotherhood</li>
                  <li className="flex items-center justify-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold"></div> Excellence</li>
                  <li className="flex items-center justify-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gold"></div> Service</li>
                </ul>
              </div>
            </div>

            <div id="history" className="max-w-3xl mx-auto border-l-2 border-gold/20 pl-8 pb-8 relative text-left">
              <div className="absolute w-4 h-4 rounded-full bg-gold -left-[9px] top-0 shadow-[0_0_10px_rgba(201,162,39,0.8)]"></div>
              <div className="font-bold text-gold tracking-widest uppercase mb-2">January 29, 1965</div>
              <h3 className="font-display text-2xl text-parchment mb-4">The Founding</h3>
              <p className="text-parchment-muted leading-relaxed text-sm">Established at the University of the Philippines Los Baños (UPLB). A select group of visionary students formed the foundation of what would become a nationwide brotherhood.</p>
            </div>
            <div className="max-w-3xl mx-auto border-l-2 border-gold/20 pl-8 pb-8 relative text-left">
              <div className="absolute w-3 h-3 rounded-full bg-onyx border-2 border-gold -left-[7px] top-0"></div>
              <div className="font-bold text-parchment-muted tracking-widest uppercase mb-2">More History</div>
              <p className="text-parchment-muted leading-relaxed text-sm italic">Additional historical milestones are continually updated in the national archives.</p>
            </div>
          </div>
        </section>

        {/* 9. NEWS & 10. EVENTS */}
        <section id="news" className="px-4 py-24 bg-onyx">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <h2 className="font-display text-3xl font-bold text-parchment sm:text-4xl uppercase tracking-wider mb-4">Latest Brotherhood News</h2>
                <div className="h-1 w-16 bg-gold/60 rounded-full"></div>
              </div>
              <Link href="/news" className="text-gold hover:text-gold-light text-sm font-bold uppercase tracking-widest flex items-center gap-2 mt-6 md:mt-0">
                View All News <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-onyx-raised border border-onyx-line rounded-lg overflow-hidden group cursor-pointer hover:border-gold/30 transition-colors">
                  <div className="h-48 bg-onyx-line/50 relative overflow-hidden flex items-center justify-center">
                    <Newspaper className="h-12 w-12 text-onyx-line opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-onyx-raised to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-4 mb-4 text-xs font-bold uppercase tracking-wider">
                      <span className="text-gold">Announcement</span>
                      <span className="text-parchment-muted/50">Sep 19, 2026</span>
                    </div>
                    <h3 className="font-display text-xl text-parchment font-bold mb-3 group-hover:text-gold transition-colors">National Convention Highlights</h3>
                    <p className="text-parchment-muted text-sm line-clamp-3 mb-6">A brief excerpt from the article highlighting the key decisions and events from the recent national gathering.</p>
                    <span className="text-gold text-sm font-bold tracking-widest uppercase flex items-center gap-2">Read More <ChevronRight className="h-3 w-3" /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 12. CALL TO ACTION */}
        <section className="relative px-4 py-32 bg-onyx border-t border-onyx-line overflow-hidden">
          <div className="absolute inset-0 bg-gold/5 mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-gold/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="container relative mx-auto max-w-4xl text-center z-10">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-parchment uppercase tracking-wider mb-6">
              Keep The Brotherhood Connected
            </h2>
            <p className="text-lg text-parchment-muted mb-12 max-w-2xl mx-auto leading-relaxed">
              Make sure your information is up to date and remain connected with Zeta Psi Omicron nationwide. Ensure you receive the latest updates, event invites, and critical communications.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/register">
                <Button variant="gold" size="lg" className="w-full sm:w-auto text-sm tracking-widest uppercase h-14 px-10 shadow-emboss">
                  Update My Biodata
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm tracking-widest uppercase h-14 px-10 border-onyx-line hover:border-gold/50 hover:bg-onyx-raised text-parchment">
                  Member Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 13. FOOTER */}
      <footer className="bg-onyx-raised border-t border-onyx-line pt-20 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 overflow-hidden rounded-full shadow-emboss">
                  <Image src="/zeta-psi-omicron-seal.png" alt="Seal" width={40} height={40} className="h-full w-full object-cover" />
                </div>
                <span className="font-display text-lg font-bold tracking-widest text-gold uppercase">
                  Zeta Psi Omicron
                </span>
              </div>
              <p className="text-sm text-parchment-muted tracking-widest uppercase font-bold mb-4">
                One Brotherhood. One Nation.
              </p>
              <p className="text-sm text-parchment-muted/60 leading-relaxed">
                The official national member information system and digital headquarters.
              </p>
            </div>
            
            <div>
              <h4 className="text-parchment font-bold uppercase tracking-widest mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-parchment-muted">
                <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
                <li><Link href="#about" className="hover:text-gold transition-colors">About Us</Link></li>
                <li><Link href="#history" className="hover:text-gold transition-colors">Fraternity History</Link></li>
                <li><Link href="/chapters" className="hover:text-gold transition-colors">Chapter Registry</Link></li>
                <li><Link href="/news" className="hover:text-gold transition-colors">News & Events</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-parchment font-bold uppercase tracking-widest mb-6">Member Services</h4>
              <ul className="space-y-4 text-sm text-parchment-muted">
                <li><Link href="/register" className="hover:text-gold transition-colors">Submit Biodata</Link></li>
                <li><Link href="/login" className="hover:text-gold transition-colors">Member Login</Link></li>
                <li><Link href="/dashboard" className="hover:text-gold transition-colors">Update Profile</Link></li>
                <li><Link href="/dashboard/directory" className="hover:text-gold transition-colors">National Directory</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-parchment font-bold uppercase tracking-widest mb-6">Contact</h4>
              <ul className="space-y-4 text-sm text-parchment-muted">
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 text-gold shrink-0" />
                  <span className="leading-relaxed">National Headquarters<br/>Manila, Philippines</span>
                </li>
                <li>
                  <Link href="mailto:admin@zetapsiomicron.org" className="hover:text-gold transition-colors">admin@zetapsiomicron.org</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-onyx-line gap-4">
            <p className="text-xs text-parchment-muted/50 tracking-widest uppercase">
              &copy; {new Date().getFullYear()} Zeta Psi Omicron Fraternity. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-xs text-parchment-muted/50 tracking-widest uppercase">
              <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gold transition-colors">Terms</Link>
              <Link href="/gate" className="hover:text-gold transition-colors">Admin Gateway</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
