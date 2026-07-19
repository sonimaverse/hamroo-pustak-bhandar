import { ArrowRight } from 'lucide-react';
import heroBrand from '../assets/hero-brand.jpg';

interface HeroProps {
  onOpenEnquiry: () => void;
}

export default function Hero({ onOpenEnquiry }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Full-page brand background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBrand})` }}
      />

      {/* Dark overlay for text readability - gradient from left */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1209]/90 via-[#1a1209]/70 to-[#1a1209]/30" />

      {/* Right side ambient glow */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gold-500/5 blur-[100px]" />

      {/* Floating dust particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-gold-300/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        {/* Left: Heading & CTAs */}
        <div className="flex w-full flex-col items-start justify-center lg:w-1/2">
          <div className="animate-fade-in">
            {/* Logo Wordmark */}
            <h1 className="font-serif leading-none">
              <span className="block font-script text-6xl text-gold-400 drop-shadow-[0_0_25px_rgba(201,154,63,0.5)] sm:text-7xl md:text-8xl">
                Hamro
              </span>
              <span className="mt-1 block text-4xl font-extrabold tracking-tight text-gold-200 sm:text-5xl md:text-6xl">
                PUSTAK BHANDAR
              </span>
            </h1>

            {/* Tagline */}
            <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-3 lg:mx-0 lg:justify-start">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500" />
              <span className="text-gold-400">&#10022;</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500" />
            </div>

            <p className="mx-auto mt-4 max-w-md font-serif text-lg text-cream-100/90 sm:text-xl lg:mx-0">
              Your Gateway To Knowledge
            </p>

            <p className="mx-auto mt-3 max-w-md text-sm text-gold-400/70 lg:mx-0">
              Trusted bookstore, educational supplier &amp; stationery distributor across Nepal.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <a
                href="#books"
                className="group inline-flex items-center gap-3 rounded-full bg-gold-400 px-8 py-3.5 text-sm font-bold tracking-widest text-brown-900 shadow-[0_0_30px_rgba(212,168,87,0.4)] transition hover:bg-gold-300 hover:shadow-[0_0_50px_rgba(212,168,87,0.6)]"
              >
                EXPLORE
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </a>
              <button
                onClick={onOpenEnquiry}
                className="inline-flex items-center gap-2 rounded-full border-2 border-gold-400/50 px-8 py-3.5 text-sm font-bold tracking-widest text-gold-300 transition hover:border-gold-400 hover:text-gold-200"
              >
                BULK ORDERS
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </span>
                <span className="text-xs font-bold tracking-wide text-gold-300">Trusted Since 2010</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-xs font-bold tracking-wide text-gold-300">100% Original</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </span>
                <span className="text-xs font-bold tracking-wide text-gold-300">All Nepal Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce lg:left-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-gold-400/60">SCROLL</span>
            <div className="h-8 w-px bg-gradient-to-b from-gold-400/60 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}