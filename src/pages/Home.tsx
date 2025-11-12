import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import WhyChooseUs from '../components/WhyChooseUs';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import FloatingWhatsAppButton from '../components/FloatingWhatsAppButton';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-orange-50 scroll-hidden pt-4 relative">
      <Navbar />
      <div className="pt-20">
        <Hero scrollY={scrollY} />
        <Categories scrollY={scrollY} />
        <FeaturedProducts scrollY={scrollY} />
        <WhyChooseUs scrollY={scrollY} />
        <CallToAction />
        <Footer />
      </div>

      <FloatingWhatsAppButton />
    </div>
  );
}
