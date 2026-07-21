import { ArrowRight, BookOpen, ShieldCheck, Truck, Award } from "lucide-react";
import heroLogo from "../assets/hero-brand.jpg";
import secondLogo from "../assets/second.jpg";
interface HeroProps {
  onOpenEnquiry: () => void;
}

export default function Hero({ onOpenEnquiry }: HeroProps) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-[#07111f] via-[#0d2240] to-[#13294d]"
    >
      {/* Background Glow */}
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-amber-400/10 blur-[140px]" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-400/10 blur-[140px]" />

      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">

        {/* LEFT CONTENT */}
        <div>

          <div className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-300">
            📚 Trusted Bookstore • Since 2010
          </div>

          <h1 className="mt-8 text-5xl font-black leading-tight text-white md:text-7xl">
            Hamro
            <span className="block text-amber-400">
              Pustak Bhandar
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Your Gateway To Knowledge. Discover school books,
            stationery, competitive exam materials and educational
            resources with fast delivery across Nepal.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <a
              href="#books"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 font-bold text-black transition hover:scale-105 hover:bg-amber-400"
            >
              <BookOpen size={20} />
              Explore Books
              <ArrowRight size={18} />
            </a>

            <button
              onClick={onOpenEnquiry}
              className="rounded-xl border border-amber-400 px-8 py-4 font-bold text-amber-300 transition hover:bg-amber-400 hover:text-black"
            >
              Bulk Orders
            </button>

          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <ShieldCheck className="mb-3 text-amber-400" />
              <h4 className="font-semibold text-white">
                Genuine Books
              </h4>
              <p className="mt-1 text-sm text-slate-400">
                100% Original
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <Truck className="mb-3 text-amber-400" />
              <h4 className="font-semibold text-white">
                Fast Delivery
              </h4>
              <p className="mt-1 text-sm text-slate-400">
                All Nepal
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <Award className="mb-3 text-amber-400" />
              <h4 className="font-semibold text-white">
                Best Price
              </h4>
              <p className="mt-1 text-sm text-slate-400">
                Student Friendly
              </p>
            </div>

          </div>

        </div>
                {/* RIGHT SIDE */}
        <div className="relative flex justify-center">

          <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-amber-400/10 to-blue-500/10 blur-3xl" />

          <div className="relative w-full max-w-lg space-y-6">

            {/* Main Card */}
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">

              <img
                src={heroLogo}
                alt="Hamro Pustak Bhandar"
                className="mx-auto max-h-[320px] w-full rounded-2xl object-contain"
              />

              <div className="mt-6 text-center">
                <span className="rounded-full bg-amber-400/20 px-4 py-2 text-sm font-semibold text-amber-300">
                  Official Brand Identity
                </span>
              </div>

            </div>

            {/* Second Card */}
            <div className="flex items-center gap-5 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">

              <img
                src={secondLogo}
                alt="Second Logo"
                className="h-24 w-24 rounded-2xl bg-white p-2 object-contain"
              />

              <div>
                <h3 className="text-xl font-bold text-white">
                  Your Gateway To Knowledge
                </h3>

                <p className="mt-2 text-sm text-slate-300">
                  Educational books, stationery, school supplies and much more.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}