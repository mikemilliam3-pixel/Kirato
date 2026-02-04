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
    const bb = tg?.BackButton;

    /**
     * Strict Feature Detection Guard:
     * We verify that the BackButton object exists and all required methods 
     * are actual functions before calling them. This prevents the 
     * "[Telegram.WebApp] BackButton is not supported in version 6.0" warning.
     */
    const canUseBackButton = 
      bb && 
      typeof bb.show === 'function' && 
      typeof bb.hide === 'function' && 
      typeof bb.onClick === 'function' && 
      typeof bb.offClick === 'function';

    const isRoot = isRootPage(location.pathname);

    // Sync visibility only if supported
    if (canUseBackButton) {
      try {
        if (isRoot) {
          bb.hide();
        } else {
          bb.show();
        }
      } catch (err) {
        // Silent catch for potential SDK internal errors
      }
    }

    const handleTgBackClick = () => {
      // Internal navigation
      navigate(-1);
      // Re-push guard state to ensure the app doesn't close on next hardware back
      window.history.pushState({ isGuard: true }, '');
    };

    // Attach listener only if supported
    if (canUseBackButton) {
      try {
        bb.onClick(handleTgBackClick);
      } catch (err) {}
    }

    return () => {
      // Safe cleanup guarded by feature detection
      if (canUseBackButton) {
        try {
          bb.offClick(handleTgBackClick);
        } catch (err) {}
      }
    };
  }, [location.pathname, navigate, isRootPage]);

  // 2. Intercept Hardware Back Button (Popstate)
  // This logic must run independently of Telegram BackButton support
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