import { Truck, Shield, Clock, HeadphonesIcon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface WhyChooseUsProps {
  scrollY: number;
}

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Same-day delivery within Port Harcourt and environs',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: 'All products verified for quality and freshness',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: Clock,
    title: 'Open 24/7',
    description: 'Shop anytime, anywhere at your convenience',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: HeadphonesIcon,
    title: 'Customer Support',
    description: 'Dedicated team ready to assist you always',
    color: 'from-purple-500 to-pink-500',
  },
];

export default function WhyChooseUs({ scrollY }: WhyChooseUsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Why Choose Mustabil?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for all your shopping needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className={`transition-all duration-700 transform ${
                  isVisible
                    ? 'translate-y-0 opacity-100 scale-100'
                    : 'translate-y-20 opacity-0 scale-95'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                  <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
