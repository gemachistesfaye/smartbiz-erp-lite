import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    if (localStorage.getItem(STORAGE_KEYS.PWA_DISMISSED) === 'true') {
      setIsDismissed(true);
    }

    // Check if already in standalone mode
    const checkStandalone = () => {
      const matchMedia = window.matchMedia('(display-mode: standalone)');
      setIsStandalone(
        matchMedia.matches ||
          ('standalone' in window.navigator &&
            !!(window.navigator as Record<string, unknown>).standalone),
      );
    };
    checkStandalone();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      alert(
        'App installation is not currently available in this browser or environment (requires HTTPS/localhost and PWA support).',
      );
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the prompt, it can only be used once
    setDeferredPrompt(null);
    setIsInstallable(false);
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.PWA_DISMISSED, 'true');
    setIsDismissed(true);
  }, []);

  return {
    isInstallable: isInstallable && !isStandalone,
    showPrompt: isInstallable && !isStandalone && !isDismissed,
    isStandalone,
    promptInstall,
    dismissPrompt,
  };
}
