import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button after scrolling down 100px
  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappNumber = '+2348102156440'; // Replace with your WhatsApp number
  const message = encodeURIComponent('Hello Mustabil! I am coming from your website. I would like to make enquiry about ....');

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 
        rounded-full shadow-xl flex items-center justify-center cursor-pointer 
        transform transition-all duration-500
        ${isVisible ? 'scale-100 opacity-100 animate-bounce' : 'scale-0 opacity-0'}
        hover:scale-110 hover:shadow-2xl hover:rotate-12
      `}
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-8 h-8 text-white drop-shadow-lg animate-pulse" />
    </a>
  );
}
