import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, ShieldCheck, Truck, Percent, Award, Building2, Sparkles } from 'lucide-react';
import heroBrandImg from '../../assets/hero-brand.jpg';
import secondBrandImg from '../../assets/second.jpg';

export const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-[#071126] via-[#0F1E3D] to-[#172B54] text-white rounded-3xl overflow-hidden shadow-xl border border-blue-900/50 mb-12">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-[500px] sm:h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-[400px] sm:h-[400px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-4 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left Column: Brand Typography & Call to Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Official Publisher & Bookstore Network</span>
            </div>

            {/* Main Brand Title & Taglines */}
            <div>
              <p className="text-amber-400 font-serif italic text-base sm:text-xl font-medium tracking-wide">
                Welcome to
              </p>
              <h1 className="text-2xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white mt-1 leading-tight break-words">
                Hamro <span className="text-amber-400">PUSTAK</span> BHANDAR
              </h1>
              <p className="text-lg sm:text-2xl font-serif italic text-blue-200 mt-1 sm:mt-2 font-semibold">
                "Your Gateway To Knowledge"
              </p>
              <div className="h-0.5 w-28 bg-gradient-to-r from-amber-400 to-transparent my-2 sm:my-3" />
              <p className="text-[9px] sm:text-xs font-sans tracking-normal sm:tracking-widest uppercase font-bold text-amber-200/90 leading-tight">
                YOUR NEIGHBOURHOOD BOOKSTORE <span className="hidden sm:inline">•</span> <br className="sm:hidden" /> YOUR TRUSTED BOOK STORE
              </p>
            </div>

            {/* Nepali Slogan */}
            <p className="text-amber-300 font-medium text-xs sm:text-base italic">
              "सबैका लागि, सधैंका लागि" — Quality books for schools, colleges, readers & institutions across Nepal.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
              <Link
                to="/shop"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/enquiry"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm border border-white/20 transition flex items-center gap-2 backdrop-blur-xs"
              >
                <Building2 className="w-4 h-4 text-amber-300" />
                <span>Institutional Quotations</span>
              </Link>

              <Link
                to="/wholesale"
                className="px-4 py-2 sm:px-5 sm:py-3 text-amber-300 hover:text-amber-200 font-bold text-xs sm:text-sm underline underline-offset-4 transition"
              >
                Wholesale Application &rarr;
              </Link>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-4 sm:pt-6 border-t border-blue-900/80 text-xs font-semibold text-stone-300">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Nepal Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Wholesale Rates</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>CDC Approved Books</span>
              </div>
            </div>

          </div>

          {/* Right Column: Client Brand Image Display */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm rounded-2xl p-2 bg-gradient-to-b from-amber-400/30 via-blue-500/10 to-amber-500/20 border border-amber-400/30 shadow-2xl overflow-hidden group">
              
              {/* Client Reference Image Banner */}
              <div className="rounded-xl overflow-hidden bg-white shadow-md">
                <img
                  src={secondBrandImg}
                  alt="Hamro Pustak Bhandar Brand Artwork"
                  className="w-full h-auto object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* Sub Seal Banner */}
              <div className="mt-2 bg-slate-900/90 rounded-xl p-2.5 flex items-center gap-3 border border-amber-500/30">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400 shrink-0 bg-white p-0.5">
                  <img src={heroBrandImg} alt="Seal Emblem" className="w-full h-full object-contain" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-serif font-bold text-amber-300">Hamro Pustak Bhandar</p>
                  <p className="text-[10px] text-stone-300">Authorized Educational Supplier</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

