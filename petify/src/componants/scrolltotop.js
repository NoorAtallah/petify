import React, { useState, useEffect } from 'react';
import { Cat, ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center justify-center w-16 h-16 bg-brown text-white rounded-full transition-colors duration-300 hover:bg-green focus:outline-none"
          aria-label="Scroll to top"
        >
          <Cat size={20} className="mb-1" />
          <ChevronUp size={16} />
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;