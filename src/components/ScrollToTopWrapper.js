import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTopWrapper({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
}

export default ScrollToTopWrapper;
