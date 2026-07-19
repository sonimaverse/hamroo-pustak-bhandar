import { useState } from 'react';
import { Menu, X, ShieldCheck, FileText } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Books', href: '#books' },
  { label: 'Stationery', href: '#stationery' },
  { label: 'Wholesale', href: '#wholesale' },
  { label: 'Contact', href: '#contact' },
];

interface HeaderProps {
  onSwitchToAdmin: () => void;
  onOpenEnquiry: () => void;
}

export default function Header({ onSwitchToAdmin, onOpenEnquiry }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-[#1a1209]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400">
            <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="24" cy="24" r="21" />
              <path d="M16 15h16v18l-8-4-8 4V15z" strokeLinejoin="round" />
              <path d="M16 15c0-2 2-3 4-3M32 15c0-2-2-3-4-3" />
            </svg>
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="whitespace-nowrap">
              <span className="font-script text-2xl leading-none text-gold-400">Hamro</span>{' '}
              <span className="font-serif text-lg font-bold tracking-wider text-gold-200">PUSTAK BHANDAR</span>
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-bold tracking-widest text-gold-200/80 transition hover:text-gold-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={onOpenEnquiry}
            className="rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-xs font-bold tracking-wider text-gold-300 transition hover:bg-gold-500/20"
          >
            <span className="flex items-center gap-2">
              <FileText size={14} />
              ENQUIRY
            </span>
          </button>
          <button
            onClick={onSwitchToAdmin}
            className="text-gold-400/50 transition hover:text-gold-400"
            title="Admin access"
          >
            <ShieldCheck size={16} />
          </button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gold-300 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gold-500/10 bg-[#1a1209]/95 px-4 py-6 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-4 py-3 text-sm font-bold tracking-wider text-gold-200 hover:bg-gold-500/10"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { onOpenEnquiry(); setMobileOpen(false); }}
              className="rounded-lg border border-gold-500/30 bg-gold-500/10 px-4 py-3 text-left text-sm font-bold tracking-wider text-gold-300"
            >
              Institutional Enquiry
            </button>
            <button
              onClick={() => { onSwitchToAdmin(); setMobileOpen(false); }}
              className="rounded-lg px-4 py-3 text-left text-sm font-bold tracking-wider text-gold-400/60"
            >
              Admin
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}