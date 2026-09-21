"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingNav() {
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "history", "chapters", "news"];
      let current = "";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section top is above the middle of the viewport
          if (rect.top <= window.innerHeight / 3) {
            current = `#${section}`;
          }
        }
      }

      setActiveHash(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#about", label: "About" },
    { href: "#history", label: "History" },
    { href: "#chapters", label: "Chapters" },
    { href: "/dashboard/directory", label: "Members", isExternal: true },
    { href: "#news", label: "News" },
  ];

  return (
    <nav className="hidden items-center gap-8 md:flex text-sm font-medium tracking-wide">
      <Link 
        href="/" 
        className={activeHash === "" ? "text-gold border-b border-gold pb-1" : "text-parchment-muted hover:text-gold transition-colors"}
        onClick={() => setActiveHash("")}
      >
        Home
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={
            activeHash === item.href && !item.isExternal
              ? "text-gold border-b border-gold pb-1"
              : "text-parchment-muted hover:text-gold transition-colors"
          }
          onClick={() => {
            if (!item.isExternal) {
              setActiveHash(item.href);
            }
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
