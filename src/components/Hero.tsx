import { ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  scrollY: number;
}

export default function Hero({ scrollY }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const parallaxOffset = scrollY * 0.5;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-4">
      <div
        className="absolute inset-0 opacity-10"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6 animate-bounce-slow">
            <Sparkles className="w-4 h-4" />
            <span>Bori Camp's Premier Shopping Destination</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-6 leading-tight">
            <span className="block mb-2">Welcome to</span>
            <span className="block bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Mustabil Superstore
            </span>
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-10 max-w-3xl mx-auto font-light">
            Your one-stop shop for quality foodstuff, baby essentials, and household items delivered right to your doorstep
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/products')}
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-6 h-6" />
              <span>Start Shopping</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                const categoriesSection = document.getElementById('categories-section');
                categoriesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-emerald-100"
            >
              View Categories
            </button>
          </div>
        </div>

        <div
          className={`mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {[
            { number: '5000+', label: 'Products' },
            { number: '10k+', label: 'Happy Customers' },
            { number: '24/7', label: 'Support' },
            { number: 'Fast', label: 'Delivery' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-gray-400 rounded-full animate-scroll" />
        </div>
      </div>
    </section>
  );
}
