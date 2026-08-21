import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800">

          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-700 text-amber-100 flex items-center justify-center font-bold text-lg shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>

              <span className="text-xl font-serif font-bold text-white">
                Hamro Pustak Bhandar
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Your trusted bookstore for books, educational materials,
              and wholesale book distribution in Nepal.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>

            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/shop"
                  className="hover:text-white transition"
                >
                  Catalog Explorer
                </Link>
              </li>

              <li>
                <Link
                  to="/wholesale"
                  className="hover:text-white transition"
                >
                  B2B Wholesale Portal
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="hover:text-white transition"
                >
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="hover:text-white transition"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Support
            </h4>

            <ul className="space-y-2 text-xs text-stone-400">
              <li>Open Everyday: 9:00 AM - 6:00 PM</li>
              <li>Book Orders • Wholesale • Customer Support</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Contact Us
            </h4>

            <div className="space-y-3 text-xs text-stone-400">

              {/* Location */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />

                <span>
                  Near Om Shanti Academy,
                  <br />
                  Bharatpur, Chitwan, Nepal
                </span>
              </div>

              {/* Phone */}
              <a
                href="tel:+9779866115029"
                className="flex items-center gap-2 hover:text-white transition"
              >
                <Phone className="w-4 h-4 text-red-500 shrink-0" />

                <span>
                  +977 9866115029
                </span>
              </a>

              {/* Email */}
              <a
                href="mailto:hamropustakbhandar7@gmail.com"
                className="flex items-start gap-2 hover:text-white transition break-all"
              >
                <Mail className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />

                <span>
                  hamropustakbhandar7@gmail.com
                </span>
              </a>

            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">

          <p>
            © {new Date().getFullYear()} Hamro Pustak Bhandar.
            All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <Link
              to="/dev/api-inspector"
              className="text-stone-500 hover:text-stone-300 transition"
            >
              API Inspector
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};