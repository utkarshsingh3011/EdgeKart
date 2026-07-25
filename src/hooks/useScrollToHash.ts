import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      
      // Small timeout to allow target section markup to mount/render
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80; // Standard sticky header offset
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 150);

      return () => clearTimeout(timer);
    } else {
      // Scroll to top of the page if no hash parameter is specified
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [location.pathname, location.hash, location.key]);
};
