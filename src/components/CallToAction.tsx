import { Phone, Mail, MapPin, ArrowRight, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl sm:text-2xl text-emerald-50 max-w-3xl mx-auto mb-10">
            Join thousands of satisfied customers in Port Harcourt
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/products')}
              className="group w-full sm:w-auto px-8 py-4 bg-white text-emerald-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="mailto:bilqismustapha2@gmail.com"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-700/50 backdrop-blur-sm text-white rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-emerald-700 transition-all duration-300 text-center"
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Call Us</h3>
            <p className="text-emerald-50">+234 810 215 6440</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Email Us</h3>
            <p className="text-emerald-50 text-center">bilqismustapha2@gmail.com</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Visit Us</h3>
            <p className="text-emerald-50">Port Harcourt, Nigeria</p>
          </div>
        </div>
      </div>
    </section>
  );
}
