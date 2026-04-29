import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    
    window.scrollTo(0, 0);
    
    
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    
    const scrollableContainers = document.querySelectorAll(
      '[class*="overflow"], [class*="scroll"], .main-content, main, [role="main"]'
    );
    
    scrollableContainers.forEach(container => {
      container.scrollTop = 0;
    });
    
  }, [pathname]);

  return null;
}

export default ScrollToTop;