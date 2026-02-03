import { useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Prevents Telegram WebApp from closing on Android hardware back button.
 * Uses a single persistent history entry to catch popstate events and performs internal routing.
 */
export const useAndroidBackGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasPushedInitialGuard = useRef(false);

  // Root pages where exit is blocked
  const isRootPage = useCallback((path: string) => {
    const roots = ['/', '/explore', '/profile', '/settings', '/notifications', '/billing'];
    return roots.includes(path);
  }, []);

  // 1. Synchronize Telegram Native BackButton UI
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    const backButton = tg.BackButton;
    const isRoot = isRootPage(location.pathname);

    if (isRoot) {
      backButton.hide();
    } else {
      backButton.show();
    }

    const handleTgBackClick = () => {
      // Internal navigation
      navigate(-1);
      // Re-push guard state to ensure the app doesn't close on next hardware back
      window.history.pushState({ isGuard: true }, '');
    };

    backButton.onClick(handleTgBackClick);
    return () => {
      backButton.offClick(handleTgBackClick);
    };
  }, [location.pathname, navigate, isRootPage]);

  // 2. Intercept Hardware Back Button (Popstate)
  useEffect(() => {
    // Push the dummy state exactly once on mount to "catch" the hardware back gesture
    if (!hasPushedInitialGuard.current) {
      window.history.pushState({ isGuard: true }, '');
      hasPushedInitialGuard.current = true;
    }

    const handlePopState = (event: PopStateEvent) => {
      // The hardware back button was pressed, which removed our guard state.
      // We must immediately re-push the guard state to prevent the next back from exiting.
      window.history.pushState({ isGuard: true }, '');

      if (!isRootPage(location.pathname)) {
        // Not on a root page: Perform internal back navigation
        navigate(-1);
      } else {
        // On a root page: Blocking exit
        console.debug("Hardware back blocked on root page to prevent WebApp exit.");
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, navigate, isRootPage]);
};
