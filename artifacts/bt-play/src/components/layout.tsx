import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col w-full selection:bg-primary selection:text-white">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="text-slate-800" style={{ fontFamily: "'Pacifico', cursive", fontSize: "1.6rem" }} data-testid="link-logo">
            BT Play
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "/packages", label: "Packages" },
              { href: "/gallery", label: "Gallery" },
              { href: "/about", label: "About" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-widest uppercase transition-colors hover:text-primary ${location === link.href ? "text-primary font-medium" : "text-slate-500"}`}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button asChild className="hidden md:inline-flex rounded-none px-8 tracking-widest uppercase text-xs">
            <Link href="/contact" data-testid="link-nav-cta">Book</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="bg-slate-50 py-24 border-t border-gray-100 mt-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 style={{ fontFamily: "'Pacifico', cursive", fontSize: "1.5rem" }} className="text-slate-800 mb-6">BT Play</h3>
            <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
              Luxury soft play hire for stylish little celebrations. We bring beautifully styled, premium play experiences to your special events.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase text-slate-800 mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/packages" className="text-slate-500 hover:text-primary transition-colors">Packages</Link></li>
              <li><Link href="/gallery" className="text-slate-500 hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/about" className="text-slate-500 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/faq" className="text-slate-500 hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-widest uppercase text-slate-800 mb-6">Contact</h4>
            <ul className="space-y-4 text-slate-500">
              <li><a href="mailto:hello@btplay.co.uk" className="hover:text-primary transition-colors">hello@btplay.co.uk</a></li>
              <li>
                <a
                  href="https://www.instagram.com/btplayhire"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                  aria-label="Follow us on Instagram @btplayhire"
                >
                  <InstagramIcon className="w-5 h-5" />
                  <span>@btplayhire</span>
                </a>
              </li>
              <li className="pt-4">
                <Link href="/contact" className="text-primary hover:underline underline-offset-4">Book Now</Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button asChild size="lg" className="rounded-full shadow-lg h-14 px-8 tracking-widest uppercase text-xs">
          <Link href="/contact">Book</Link>
        </Button>
      </div>
    </div>
  );
}
