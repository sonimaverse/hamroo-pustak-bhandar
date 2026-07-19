import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-[#1a1209]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-script text-4xl text-gold-400">Hamro</p>
          <p className="font-serif text-xl font-bold tracking-wider text-gold-200">PUSTAK BHANDAR</p>
          <p className="mt-4 text-sm text-gold-400/60 leading-relaxed">
            Your neighbourhood bookstore for school books, stationery and wholesale supply across Nepal.
          </p>
        </div>

        <div>
          <p className="mb-5 text-xs font-bold tracking-widest text-gold-400">EXPLORE</p>
          <ul className="space-y-3 text-sm text-gold-300/70">
            <li><a href="#books" className="transition hover:text-gold-300">Books</a></li>
            <li><a href="#stationery" className="transition hover:text-gold-300">Stationery</a></li>
            <li><a href="#wholesale" className="transition hover:text-gold-300">Wholesale Portal</a></li>
            <li><a href="#about" className="transition hover:text-gold-300">About Us</a></li>
          </ul>
        </div>

        <div>
          <p className="mb-5 text-xs font-bold tracking-widest text-gold-400">CATEGORIES</p>
          <ul className="space-y-3 text-sm text-gold-300/70">
            <li><a href="#" className="transition hover:text-gold-300">School Books</a></li>
            <li><a href="#" className="transition hover:text-gold-300">Novels &amp; Fiction</a></li>
            <li><a href="#" className="transition hover:text-gold-300">Competitive Exams</a></li>
            <li><a href="#" className="transition hover:text-gold-300">Children&rsquo;s Books</a></li>
          </ul>
        </div>

        <div>
          <p className="mb-5 text-xs font-bold tracking-widest text-gold-400">CONTACT</p>
          <ul className="space-y-4 text-sm text-gold-300/70">
            <li className="flex items-center gap-3"><Phone size={16} className="text-gold-400" /> 056-123456</li>
            <li className="flex items-center gap-3"><Mail size={16} className="text-gold-400" /> hello@hamropustak.com.np</li>
            <li className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 text-gold-400" /> Bharatpur, Chitwan, Nepal</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold-500/10 py-6 text-center text-xs text-gold-400/40">
        &copy; {new Date().getFullYear()} Hamro Pustak Bhandar. All rights reserved.
      </div>
    </footer>
  );
}