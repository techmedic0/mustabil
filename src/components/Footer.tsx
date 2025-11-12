import { Facebook, Instagram, Twitter, ShoppingBag } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Mustabil Superstore</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Port Harcourt's premier shopping destination for quality foodstuff, baby items, and household essentials. Your satisfaction is our priority.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Categories</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Customer Care</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Delivery Info</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} Mustabil Superstore. All rights reserved. Made with care in Port Harcourt.
          </p>
        </div>
      </div>
    </footer>
  );
}
