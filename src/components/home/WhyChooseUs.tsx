import React from 'react';
import { BookOpen, Truck, ShieldCheck, Award } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Extensive Nepali & Global Literature',
      description: 'Carefully curated textbooks, reference guides, national curricula, and international bestsellers.',
    },
    {
      icon: Truck,
      title: 'Reliable Nationwide Distribution',
      description: 'Express shipping across Kathmandu Valley and scheduled logistics to all 77 districts of Nepal.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Original Publications',
      description: 'Guaranteed 100% authentic editions directly sourced from certified publishers and authors.',
    },
    {
      icon: Award,
      title: 'Dedicated Institutional Accounts',
      description: 'Exclusive tier discounts, bulk quotes, and PAN/VAT billing for schools, colleges, and libraries.',
    },
  ];

  return (
    <section className="my-12">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-red-700">Why Hamro Pustak Bhandar</span>
        <h2 className="text-2xl font-serif font-bold text-stone-900 mt-1">Built for Readers, Schools & Retailers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">{feat.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-normal">{feat.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
