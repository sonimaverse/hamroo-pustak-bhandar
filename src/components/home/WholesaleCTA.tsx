import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';

export const WholesaleCTA: React.FC = () => {
  return (
    <section className="my-8 sm:my-12 bg-gradient-to-r from-[#071126] via-[#0F1E3D] to-[#122247] text-amber-50 rounded-3xl p-4 sm:p-10 lg:p-12 border border-blue-900/60 shadow-xl relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center relative z-10">
        
        {/* Wholesale Card */}
        <div className="space-y-4 bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>For Bookstores & Retailers</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Apply for Wholesale Merchant Account
          </h2>

          <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed">
            Own a bookstore or stationery shop in Nepal? Unlock tiered wholesale pricing, catalog discounts, and invoice billing.
          </p>

          <div className="space-y-2 text-xs font-medium text-amber-100 py-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified Wholesale Discounts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>VAT / Tax Invoice Support</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/wholesale"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
            >
              <span>Apply for Wholesale Access</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Institutional Quotation Card */}
        <div className="space-y-4 bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Schools, Colleges & Offices</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Request an Institutional Quotation
          </h2>

          <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed">
            Ordering curriculum textbooks or stationery for your educational institution or corporate office? Get a formal rate quote.
          </p>

          <div className="space-y-2 text-xs font-medium text-amber-100 py-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bulk School / College Supply Rates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>24-Hour Custom Quotation Delivery</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/enquiry"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-stone-100 text-[#0F1E3D] font-bold rounded-xl text-xs shadow-md transition"
            >
              <span>Submit Quotation Request</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

